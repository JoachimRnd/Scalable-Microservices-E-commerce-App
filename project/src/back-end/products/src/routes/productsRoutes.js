const express = require('express');
const router = express.Router();
const log = require('debug')('products-d');
const authMiddleware = require('../middleware/authMiddleware');

module.exports = (productsCrud) => {
  router.post('/', authMiddleware, (req, res) => {
    const product = req.body.product;

    console.log('Creating new product');
    productsCrud.createProduct(product)
    .then((successMessage) => res.status(200).json({ status: 'success', message: successMessage }))
    .catch((err) => res.status(409).json({ status: 'error', message: String(err) }));
    // } else {
    //   console.log('Updating product');
    //   productsCrud.updateProduct(product)
    //   .then((successMessage) => res.status(200).json({ status: 'success', message: successMessage }))
    //   .catch((err) => res.status(409).json({ status: 'error', message: String(err) }));
    // }
  });

  router.put('/', authMiddleware, (req, res) => {
    console.log('Updating product');
    const product = req.body.product;

    productsCrud.updateProduct(product)
      .then((successMessage) => res.status(200).json({ status: 'success', message: successMessage }))
      .catch((err) => res.status(409).json({ status: 'error', message: String(err) }));
  });

  router.get('/', (req, res) => {
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
