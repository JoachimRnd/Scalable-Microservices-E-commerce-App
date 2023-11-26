const express = require('express');
const router = express.Router();
const log = require('debug')('users-d');
const authMiddleware = require('../middleware/authMiddleware');


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
      res.status(200).json({ status: 'success', message: 'Cart successfully saved' });
    } catch (error) {
      console.log(error);
      res.status(409).json({ status: 'error', message: error.message });
    }
  });


  router.get('/', authMiddleware, async (req, res) => {
    try {
      const userId = req.userId;
      const userCart = await cartCrud.getCartById(userId);
      const cart = userCart.length > 0 ? userCart[0].items : {};
      res.status(200).json({ status: 'success', cart });
    } catch (error) {
      console.log(error);
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
      res.status(200).json({ status: 'success', message: 'Cart successfully deleted' });
    } catch (error) {
      console.log(error);
      res.status(500).json({ status: 'error', message: 'Internal Server Error' });
    }
  });

  return router;
};
