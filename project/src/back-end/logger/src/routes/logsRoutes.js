const express = require('express');
const router = express.Router();

const loggerCrudUser = require('../utils/crud/crud-log-users');
const loggerCrudOrder = require('../utils/crud/crud-log-orders');
const loggerCrudCart = require('../utils/crud/crud-log-carts');
const loggerCrudProduct = require('../utils/crud/crud-log-products');

module.exports = () => {
  router.post('/user/info', (req, res) => {
    console.log('Inside logsRoutes user info')
    console.log('req.body', req.body);
    const message = req.body.message;
    const data = req.body.data;
    loggerCrudUser.info(message, data)
      .then((token) => res.status(200).json({ status: 'success', token }))
      .catch((err) => res.status(409).json({ status: 'error', message: String(err) }));
  });

  router.post('/user/error', (req, res) => {
    console.log('Inside logsRoutes user error')
    console.log('req.body', req.body);
    const message = req.body.message;
    const data = req.body.data;
    loggerCrudUser.error(message, data)
      .then((token) => res.status(200).json({ status: 'success', token }))
      .catch((err) => res.status(409).json({ status: 'error', message: String(err) }));
  });

  router.post('/orders/info', (req, res) => {
    console.log('Inside logsRoutes orders info')
    console.log('req.body', req.body);
    const message = req.body.message;
    const data = req.body.data;
    loggerCrudOrder.info(message, data)
      .then((token) => res.status(200).json({ status: 'success', token }))
      .catch((err) => res.status(409).json({ status: 'error', message: String(err) }));
  });

  router.post('/orders/error', (req, res) => {
    console.log('Inside logsRoutes orders error')
    console.log('req.body', req.body);
    const message = req.body.message;
    const data = req.body.data;
    loggerCrudOrder.error(message, data)
      .then((token) => res.status(200).json({ status: 'success', token }))
      .catch((err) => res.status(409).json({ status: 'error', message: String(err) }));
  });

  router.post('/carts/info', (req, res) => {
    console.log('Inside logsRoutes carts info')
    console.log('req.body', req.body);
    const message = req.body.message;
    const data = req.body.data;
    loggerCrudCart.info(message, data)
      .then((token) => res.status(200).json({ status: 'success', token }))
      .catch((err) => res.status(409).json({ status: 'error', message: String(err) }));
  });

  router.post('/carts/error', (req, res) => {
    console.log('Inside logsRoutes carts error')
    console.log('req.body', req.body);
    const message = req.body.message;
    const data = req.body.data;
    loggerCrudCart.error(message, data)
      .then((token) => res.status(200).json({ status: 'success', token }))
      .catch((err) => res.status(409).json({ status: 'error', message: String(err) }));
  });

  router.post('/products/info', (req, res) => {
    console.log('Inside logsRoutes products info')
    console.log('req.body', req.body);
    const message = req.body.message;
    const data = req.body.data;
    loggerCrudProduct.info(message, data)
      .then((token) => res.status(200).json({ status: 'success', token }))
      .catch((err) => res.status(409).json({ status: 'error', message: String(err) }));
  });

  router.post('/products/error', (req, res) => {
    console.log('Inside logsRoutes products error')
    console.log('req.body', req.body);
    const message = req.body.message;
    const data = req.body.data;
    loggerCrudProduct.error(message, data)
      .then((token) => res.status(200).json({ status: 'success', token }))
      .catch((err) => res.status(409).json({ status: 'error', message: String(err) }));
  });


  return router;
};
