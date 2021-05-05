'use strict';

module.exports = function (app) {

let Stock = require("../controller/stock.js");
let stockController = new Stock();

  app.route('/api/stock-prices')
    .get(async (req, res)=>{
      // console.log(req.query)
      let ip = (req.query.like === 'true') ? req.ip : false; 
      let stockData = await stockController.generateRes(req.query.stock, ip);
      res.json({stockData});
    });
    
};
