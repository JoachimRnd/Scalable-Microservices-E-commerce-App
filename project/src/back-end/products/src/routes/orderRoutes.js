const express = require('express');
const router = express.Router();
const log = require('debug')('users-d');
const authMiddleware = require('../middleware/authMiddleware'); 


module.exports = (orderCrud) => {

  router.post('/checkout',authMiddleware, (req, res) => {
    const order = req.body.order;
    const userId = req.userId;
    console.log("userId",userId);
    orderCrud.createOrder(order)
      .then((successMessage) => res.status(200).json({ status: 'success', message: successMessage }))
      .catch((err) => res.status(409).json({ status: 'error', message: String(err) }));
  });

  return router;
};
