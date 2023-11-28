const express = require('express');
const router = express.Router();

const loggerCrud = require('../utils/crud/crud-log');

const logsUser = require('nano')(`${process.env.DB_URL}/users-d-logs`);
const logsOrders = require('nano')(`${process.env.DB_URL}/orders-d-logs`);
const logsCarts = require('nano')(`${process.env.DB_URL}/carts-d-logs`);
const logsProducts = require('nano')(`${process.env.DB_URL}/products-d-logs`);
const logsInfoUser = require('nano')(`${process.env.DB_URL}/user-info-logs`);


module.exports = () => {
  

  router.post('/user/info', (req, res) => {
    loggerCrud.info(req.body, logsUser)
      .then((token) => res.status(200).json({ status: 'success', token }))
      .catch((err) => res.status(409).json({ status: 'error', message: String(err) }));
  });

  router.post('/user/error', (req, res) => {
    loggerCrud.error(req.body, logsUser)
      .then((token) => res.status(200).json({ status: 'success', token }))
      .catch((err) => res.status(409).json({ status: 'error', message: String(err) }));
  });

  router.post('/orders/info', (req, res) => {
    loggerCrud.info(req.body, logsOrders)
      .then((token) => res.status(200).json({ status: 'success', token }))
      .catch((err) => res.status(409).json({ status: 'error', message: String(err) }));
  });

  router.post('/orders/error', (req, res) => {
    loggerCrud.error(req.body, logsOrders)
      .then((token) => res.status(200).json({ status: 'success', token }))
      .catch((err) => res.status(409).json({ status: 'error', message: String(err) }));
  });

  router.post('/carts/info', (req, res) => {
    loggerCrud.info(req.body, logsCarts)
      .then((token) => res.status(200).json({ status: 'success', token }))
      .catch((err) => res.status(409).json({ status: 'error', message: String(err) }));
  });

  router.post('/carts/error', (req, res) => {
    loggerCrud.error(req.body, logsCarts)
      .then((token) => res.status(200).json({ status: 'success', token }))
      .catch((err) => res.status(409).json({ status: 'error', message: String(err) }));
  });

  router.post('/products/info', (req, res) => {
    loggerCrud.info(req.body, logsProducts)
      .then((token) => res.status(200).json({ status: 'success', token }))
      .catch((err) => res.status(409).json({ status: 'error', message: String(err) }));
  });

  router.post('/products/error', (req, res) => {
    loggerCrud.error(req.body, logsProducts)
      .then((token) => res.status(200).json({ status: 'success', token }))
      .catch((err) => res.status(409).json({ status: 'error', message: String(err) }));
  });


  return router;
};
