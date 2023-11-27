const express = require('express');
const router = express.Router();
const log = require('debug')('products-d');
const authMiddleware = require('../middleware/authMiddleware');

module.exports = (productsCrud) => {
  router.post('/', authMiddleware, (req, res) => {
    console.log('create product')
    const product = req.body.product;
    productsCrud.createProduct(product)
      .then((successMessage) => res.status(200).json({ status: 'success', message: successMessage }))
      .catch((err) => res.status(409).json({ status: 'error', message: String(err) }));
  });

  router.get('/', (req, res) => {
    console.log('get all products');
    productsCrud.getProducts()
      .then((products) => res.status(200).json({ status: 'success', data: products }))
      .catch((err) => res.status(500).json({ status: 'error', message: String(err) }));
  });

  router.post('/ids', (req, res) => {
    const productIds = req.body.productIds;
    productsCrud.getProductsByIds(productIds)
      .then((products) => res.status(200).json({ status: 'success', data: products }))
      .catch((err) => res.status(500).json({ status: 'error', message: String(err) }));
  });

  return router;
};
