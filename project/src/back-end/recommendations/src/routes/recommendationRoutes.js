const express = require('express');
const router = express.Router();
const log = require('debug')('recommendations-d');
const authMiddleware = require('../middleware/authMiddleware');

const loggerCrud = require('../utils/crud/crud-logger');

module.exports = (recommendationCrud) => {

  // useful for test => to remove in production
  router.get('/launchDailyRecommendation', (req, res) => {
    recommendationCrud.generateDailyRecommendations();
    return res.status(200).json({ status: 'success', data: "Daily recommendations generation" })
  });

  // GET RECOMMENDATIONS BY PRODUCT ID AND RECOMMENDATION OF PRODUCTS IN THE SHOPPING CART
  router.get('/:productId', authMiddleware, async (req, res) => {
    try {
      const userId = req.userId;
      const productId = req.params.productId;
      const recommendations = await recommendationCrud.getRecommendations(userId, productId);
      return res.status(200).json({ status: 'success', data: recommendations });
    } catch (err) {
      // loggerCrud.error('Error fetching recommendations', { userId }, req)
      // .catch((err) => {
      //   console.log('error', err);
      // }); TODO TO IMPLEMENT
      console.error('Error fetching recommendations', err);
      return res.status(500).json({ status: 'error', message: String(err) })
    }
  });

  return router;
};
