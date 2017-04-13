const Tickers = require('../models/ticker');

const constant = require('../../config/constant');


function getTimes() {
  const year = new Date().getFullYear();
  const month = new Date().getMonth();
  const day = new Date().getDate();
  return `${year}年${month + 1}月${day}日`;
}

class TickerController {
  getTickers(req, res, next) {
    Tickers.find({}, (err, result) => {
      if (err) {
        return next(err);
      }
      return res.status(constant.httpCode.OK).send(result);
    });
  }

  createTickers(req, res, next) {
    Tickers.create(req.body, (err, result) => {
      if (err) {
        return next(err);
      }
      return res.sendStatus(constant.httpCode.CREATED);
    });
  }

  deleteTickers(req, res, next) {
    const tickerId = req.params.tickerId;
    Tickers.findByIdAndRemove(tickerId, (err, result)=> {
      if (err) {
        return next(err);
      }
      if (!result) {
        return res.sendStatus(constant.httpCode.NOT_FOUND);
      }
      return res.sendStatus(constant.httpCode.NO_CONTENT);
    });
  }

  updateTickers(req, res, next) {
    Tickers.findByIdAndUpdate(req.params.tickerId, req.body, (err, result)=> {
      if (err) {
        return next(err);
      }
      if (!result) {
        return res.sendStatus(constant.httpCode.NOT_FOUND);
      }
      return res.status(constant.httpCode.NO_CONTENT).send(result);
    });
  }
}

module.exports = TickerController;