const mongoose = require('mongoose');
const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

mongoose.connect(process.env.DB, {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false}, (err)=>{
  if(err){
    console.log(err)
  }else{
    console.log("db connected")
  }
});

const stockSchema = mongoose.Schema({
  symbol: {type: String, required: true},
  likes: {type: Number, default: 0},
  ip: [String]
});

let stocks = mongoose.model('stocks', stockSchema);

class Stock{

  getLikes(symbol, ip){
    return new Promise((resolve, reject)=>{
      stocks.findOne({symbol: symbol}, (err, doc)=>{
        if(err){
          reject(err)
        }else if(doc==null){
          let stock = new stocks({
            symbol: symbol,
            likes: (ip===false)? 0 : 1,
            ip: (ip===false)? [] : [ip]
          });
          stock.save((err, saved)=>{
            if(err){
              reject(err)
            }else{
              resolve(saved.likes);
            }
          })
        }else{
          if(ip!=false && doc.ip.indexOf(ip) == -1){
            doc.likes += 1;
            doc.ip.push(ip);
            doc.save((err, saved)=>{
              if(err){
                reject(err)
              }else{
                resolve(saved.likes);
              }
            });
          }else{
            resolve(doc.likes);
          }
        }
      });
    });
  }

  getStockPrice(symbol){
    return new Promise((resolve, reject)=>{
      var xhr = new XMLHttpRequest();
      let reqURL = "https://stock-price-checker-proxy.freecodecamp.rocks/v1/stock/"+symbol+"/quote";
      xhr.open('GET', reqURL, true);
      xhr.send(null);
      xhr.onload = ()=>{
        resolve(Math.round(JSON.parse(xhr.responseText)['latestPrice'] * 100) / 100);
      }
      
    })
  }

  async generateRes(symbol, ip){
    if(Array.isArray(symbol)){
      let likes1 = await this.getLikes(symbol[0], ip);
      let price1 = await this.getStockPrice(symbol[0]);

      let likes2 = await this.getLikes(symbol[1], ip);
      let price2 = await this.getStockPrice(symbol[1]);

      let symbol1 = {stock: symbol[0], 'rel_likes': likes1 - likes2, price: price1};
      let symbol2 = {stock: symbol[1], 'rel_likes': likes2 - likes1, price: price2};

      return [symbol1, symbol2];

    }else{
      try{
        let likes = await this.getLikes(symbol, ip);
        let price = await this.getStockPrice(symbol);
        return {stock: symbol, likes: likes, price: price};
      }catch (err) {
        console.log(err)
        return null;
      }
    }
  }

  clearDB(){
    stocks.deleteMany({}, (err, done)=>{
      if(err){console.log(err)}
    })
  }

}

module.exports = Stock;