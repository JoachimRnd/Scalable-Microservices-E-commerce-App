const express = require('express');
const router = express.Router();

const loggerCrud = require('../utils/crud/crud-log');
const authMiddleware = require('../middleware/authMiddleware');

const logsUser = require('nano')(`${process.env.DB_URL}/users-d-logs`);
const logsOrders = require('nano')(`${process.env.DB_URL}/orders-d-logs`);
const logsCarts = require('nano')(`${process.env.DB_URL}/carts-d-logs`);
const logsProducts = require('nano')(`${process.env.DB_URL}/products-d-logs`);
const logsRecommendations = require('nano')(`${process.env.DB_URL}/recommendations-d-logs`);

module.exports = () => {

  router.get('/user/info/:username', authMiddleware, async (req, res) => {
    const usrName = req.params.username;
    let result = {};

    try {
        result.orders = await loggerCrud.getUserInfo(usrName, logsOrders);

        result.carts = await loggerCrud.getUserInfo(usrName, logsCarts);

        result.products = await loggerCrud.getUserInfo(usrName, logsProducts);

        res.status(200).json({ status: 'success', data: result });
    } catch (err) {
      console.log('error', err);
        res.status(409).json({ status: 'error', message: String(err) });
    }
  });



  router.post('/recommendations/info', (req, res) => { 
    loggerCrud.info(req.body, logsRecommendations)
      .then((token) => res.status(200).json({ status: 'success', token }))
      .catch((err) => res.status(409).json({ status: 'error', message: String(err) }));
  });

  router.post('/recommendations/error', (req, res) => {
    loggerCrud.error(req.body, logsRecommendations)
      .then((token) => res.status(200).json({ status: 'success', token }))
      .catch((err) => res.status(409).json({ status: 'error', message: String(err) }));
  });


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
