const express = require('express');
const router = express.Router();
const log = require('debug')('products-d');
const authMiddleware = require('../middleware/authMiddleware');
const tokenUtils = require('../utils/tokenUtils');


const loggerCrud = require('../utils/crud/crud-logger');

module.exports = (productsCrud) => {
  router.post('/', authMiddleware, (req, res) => {
    const product = req.body.product;
    const userId = req.userId;

    productsCrud.createProduct(product)
    .then((successMessage) => {
      loggerCrud.info('Product created', { product, userId }, req)
        .catch((err) => {
          console.log('error', err);
      });
      return res.status(200).json({ status: 'success', message: successMessage })
    })
    .catch((err) => {
      loggerCrud.error('Error while creating product', { product, userId, error: err }, req)
        .catch((err) => {
          console.log('error', err);
      });
      return res.status(409).json({ status: 'error', message: String(err) })
    });
  });

  router.put('/', authMiddleware, (req, res) => {
    console.log('Updating product');
    const product = req.body.product;
    const userId = req.userId;

    productsCrud.updateProduct(product)
      .then((successMessage) => {
        loggerCrud.info('Product updated', { product, userId, old_rev: product._rev, new_rev: successMessage._rev }, req)
          .catch((err) => {
            console.log('error', err);
        });
        return res.status(200).json({ status: 'success', message: successMessage })
      })
      .catch((err) => {
        loggerCrud.error('Error while updating product', { product, userId, error: err }, req)
          .catch((err) => {
            console.log('error', err);
        });
        return res.status(409).json({ status: 'error', message: String(err) })
      });
  });

  router.delete('/', authMiddleware, (req, res) => {
    console.log('Deleting product');
    const product = req.body.product;
    const userId = req.userId;

    productsCrud.deleteProduct(product)
      .then((successMessage) => {
        loggerCrud.info('Product deleted', { product, userId }, req)
          .catch((err) => {
            console.log('error', err);
        });
        return res.status(200).json({ status: 'success', message: successMessage })
      })
      .catch((err) => {
        loggerCrud.error('Error while deleting product', { product, userId, error: err }, req)
          .catch((err) => {
            console.log('error', err);
        });
        return res.status(409).json({ status: 'error', message: String(err) })
      });
  });

  router.get('/', (req, res) => {
    productsCrud.getProducts()
      .then((products) => {
        loggerCrud.info('Products sent', { userId: 'anonymous', products }, req)
          .catch((err) => {
            console.log('error', err);
        });
        return res.status(200).json({ status: 'success', data: products })
      })
      .catch((err) => {
        loggerCrud.error('Error while sending products', { userId: 'anonymous', error: err }, req)
          .catch((err) => {
            console.log('error', err);
        });
        return res.status(500).json({ status: 'error', message: String(err) })
      });
  });

  router.get('/id', (req, res) => {
    const productsId = req.query.productsId; 
    console.log("productsId",productsId)
    const productsIdArray = productsId.split(',').map(id => id.trim());
    console.log("productsIdArray",productsIdArray)

    productsCrud.getProductsById(productsIdArray)
      .then((products) => {
        loggerCrud.info('Products sent', { userId: 'anonymous', products }, req)
          .catch((err) => {
            console.log('error', err);
        });
        return res.status(200).json({ status: 'success', data: products });
      })
      .catch((err) => {
        loggerCrud.error('Error while sending products', { userId: 'anonymous', error: err }, req)
          .catch((err) => {
            console.log('error', err);
        });
        return res.status(500).json({ status: 'error', message: String(err) });
      });
  });
  

  return router;
};
