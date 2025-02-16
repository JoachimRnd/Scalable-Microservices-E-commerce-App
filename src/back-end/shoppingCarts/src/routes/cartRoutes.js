const express = require('express');
const router = express.Router();
const log = require('debug')('users-d');
const authMiddleware = require('../middleware/authMiddleware');

const loggerCrud = require('../utils/crud/crud-logger');



module.exports = (cartCrud) => {

  router.post('/', authMiddleware, async (req, res) => {
    try {
      const cart = req.body.cart;
      const userId = req.userId;
      const existingCart = await cartCrud.getCartById(userId);
      if (existingCart.length > 0) {
        cart._rev = existingCart[0]._rev;
      }
      cart._id = userId;
      await cartCrud.saveCart(cart);
      loggerCrud.info('Cart saved', { cart, userId }, req)
        .catch((err) => {
          console.log('error', err);
      });
      res.status(200).json({ status: 'success', message: 'Cart successfully saved' });
    } catch (error) {
      loggerCrud.error('Error while saving the cart', { cart, userId, error }, req)
        .catch((err) => {
          console.log('error', err);
      });
      console.log(error);
      res.status(409).json({ status: 'error', message: error.message });
    }
  });


  router.get('/', authMiddleware, async (req, res) => {
    try {
      const userId = req.userId;
      const userCart = await cartCrud.getCartById(userId);
      const cart = userCart.length > 0 ? userCart[0].items : {};
      loggerCrud.info('Cart sent', { cart, userId }, req)
        .catch((err) => {
          console.log('error', err);
      });
      res.status(200).json({ status: 'success', cart });
    } catch (error) {
      console.log(error);
      loggerCrud.error('Error while sending the cart', { cart, userId, error}, req)
        .catch((err) => {
          console.log('error', err);
      });
      res.status(500).json({ status: 'error', message: 'Internal Server Error' });
    }
  });


  router.delete('/', authMiddleware, async (req, res) => {
    try {
      const userId = req.userId;
      const existingCart = await cartCrud.getCartById(userId);
      if (existingCart.length === 0) {
        return res.status(404).json({ status: 'error', message: 'Cart not found' });
      }
  
      const revision = existingCart[0]._rev;
      await cartCrud.deleteCart(userId, revision);
      loggerCrud.info('Cart deleted', { userId }, req)
        .catch((err) => {
          console.log('error', err);
      });
      res.status(200).json({ status: 'success', message: 'Cart successfully deleted' });
    } catch (error) {
      console.log(error);
      loggerCrud.error('Error while deleting the cart', { userId }, req)
        .catch((err) => {
          console.log('error', err);
      });
      res.status(500).json({ status: 'error', message: 'Internal Server Error' });
    }
  });


  router.delete('/:itemId', authMiddleware, async (req, res) => {
    try {
      const userId = req.userId;
      const itemId = req.params.itemId;
      await cartCrud.deleteItemFromCart(userId, itemId);
      loggerCrud.info('Item deleted from the cart', { userId, itemId }, req)
        .catch((err) => {
          console.log('error', err);
      });
      res.status(200).json({ status: 'success', message: 'Item successfully deleted from the cart' });
    } catch (error) {
      console.log(error);
      loggerCrud.error('Error while deleting the item from the cart', { userId, itemId }, req)
        .catch((err) => {
          console.log('error', err);
      });
      res.status(500).json({ status: 'error', message: 'Internal Server Error' });
    }
  });

  return router;
};
