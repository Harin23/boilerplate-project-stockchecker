const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');
const Stock = require('../controller/stock.js');
let stock = new Stock();


chai.use(chaiHttp);

suite('Functional Tests', function() {

  test("Viewing one stock", function (done) {
    chai
      .request(server)
      .get('/api/stock-prices?stock=GOOG')
      .end((err, res)=>{
        assert.equal(res.status, 200);
        assert.isTrue(res.body.hasOwnProperty("stockData"));
        assert.isTrue(res.body.stockData.hasOwnProperty("stock"));
        assert.isTrue(res.body.stockData.hasOwnProperty("price"));
        assert.isTrue(res.body.stockData.hasOwnProperty("likes"));
        done();
      });
  });

  test("Viewing one stock and liking it", function (done) {
    chai
      .request(server)
      .get('/api/stock-prices?stock=GOOG&like=true')
      .end((err, res)=>{
        assert.equal(res.status, 200);
        assert.isTrue(res.body.hasOwnProperty("stockData"));
        assert.equal(res.body.stockData.stock, 'GOOG');
        assert.isTrue(res.body.stockData.hasOwnProperty("price"));
        assert.equal(res.body.stockData.likes, 1);
        done();
      });
  });

  test("Viewing the same stock and liking it again", function (done) {
    chai
      .request(server)
      .get('/api/stock-prices?stock=GOOG&like=true')
      .end((err, res)=>{
        assert.equal(res.status, 200);
        assert.isTrue(res.body.hasOwnProperty("stockData"));
        assert.equal(res.body.stockData.stock, 'GOOG');
        assert.isTrue(res.body.stockData.hasOwnProperty("price"));
        assert.equal(res.body.stockData.likes, 1);
        done();
      });
  });

  test("Viewing two stocks", function (done) {
    chai
      .request(server)
      .get('/api/stock-prices?stock=GOOG&stock=MSFT')
      .end((err, res)=>{
        assert.equal(res.status, 200);
        assert.isTrue(res.body.hasOwnProperty("stockData"));
        assert.isTrue(Array.isArray(res.body.stockData));
        assert.isTrue(res.body.stockData[0].hasOwnProperty("stock"));
        assert.isTrue(res.body.stockData[0].hasOwnProperty("price"));
        assert.isTrue(res.body.stockData[0].hasOwnProperty("rel_likes"));
        assert.isTrue(res.body.stockData[1].hasOwnProperty("stock"));
        assert.isTrue(res.body.stockData[1].hasOwnProperty("price"));
        assert.isTrue(res.body.stockData[1].hasOwnProperty("rel_likes"));
        assert.equal(res.body.stockData[0].rel_likes, res.body.stockData[1].rel_likes * -1)
        done();
      });
  });

  test("Viewing two stocks and liking them", function (done) {
    chai
      .request(server)
      .get('/api/stock-prices?stock=GOOG&stock=MSFT&like=true')
      .end((err, res)=>{
        assert.equal(res.status, 200);
        assert.isTrue(res.body.hasOwnProperty("stockData"));
        assert.isTrue(Array.isArray(res.body.stockData));
        assert.isTrue(res.body.stockData[0].hasOwnProperty("stock"));
        assert.isTrue(res.body.stockData[0].hasOwnProperty("price"));
        assert.isTrue(res.body.stockData[0].hasOwnProperty("rel_likes"));
        assert.isTrue(res.body.stockData[1].hasOwnProperty("stock"));
        assert.isTrue(res.body.stockData[1].hasOwnProperty("price"));
        assert.isTrue(res.body.stockData[1].hasOwnProperty("rel_likes"));
        assert.equal(res.body.stockData[0].rel_likes, res.body.stockData[1].rel_likes * -1)
        stock.clearDB();
        done();
      });
  });

});
