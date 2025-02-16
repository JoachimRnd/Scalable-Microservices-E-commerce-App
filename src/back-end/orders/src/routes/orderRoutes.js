const express = require('express');
const router = express.Router();
const log = require('debug')('users-d');
const authMiddleware = require('../middleware/authMiddleware');

const loggerCrud = require('../utils/crud/crud-logger');

module.exports = (orderCrud) => {

  router.post('/', authMiddleware, (req, res) => {
    const order = req.body.order;
    const userId = req.userId;
    order.userId = userId;
    orderCrud.createOrder(order)
      .then((successMessage) => {
        loggerCrud.info('Order created', { order, userId }, req)
          .catch((err) => {
            console.log('error', err);
        });
        return res.status(200).json({ status: 'success', message: successMessage })
        })
      .catch((err) => {
        loggerCrud.error('Error while creating order', { order, userId, error: err }, req)
          .catch((err) => {
            console.log('error', err);
        });
        return res.status(409).json({ status: 'error', message: String(err) })
        });
  });

  router.get('/', authMiddleware, (req, res) => {
    const userId = req.userId;

    orderCrud.getOrdersByUserId(userId)
      .then((orders) => {
        loggerCrud.info('Orders sent', { userId }, req)
          .catch((err) => {
            console.log('error', err);
        });
        return res.status(200).json({ status: 'success', data: orders })
      })
      .catch((err) => {
        loggerCrud.error('Error while sending orders', { userId, error: err }, req)
          .catch((err) => {
            console.log('error', err);
        });
        return res.status(500).json({ status: 'error', message: String(err) })
      });
  });


  return router;
};
