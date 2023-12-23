const express = require('express');
const router = express.Router();
const log = require('debug')('recommendations-d');
const authMiddleware = require('../middleware/authMiddleware');

const loggerCrud = require('../utils/crud/crud-logger');

module.exports = (recommendationCrud) => {

  // useful for test => to remove in production
  router.get('/launchDailyRecommendation', (req, res) => {
    try {
      recommendationCrud.generateDailyRecommendations();
      loggerCrud.info('Daily recommendations generated', {}, req)
      return res.status(200).json({ status: 'success', data: "Daily recommendations generated" })
    } catch (err) {
      loggerCrud.error('Error generating daily recommendations', {}, err);
      console.error('Error generating daily recommendations', err);
      return res.status(500).json({ status: 'error', message: String(err) })
    }
  });

  // GET RECOMMENDATIONS BY PRODUCT ID AND RECOMMENDATION OF PRODUCTS IN THE SHOPPING CART
  router.get('/:productId', authMiddleware, async (req, res) => {
    try {
      const userId = req.userId;
      const productId = req.params.productId;
      const recommendations = await recommendationCrud.getRecommendations(userId, productId);
      loggerCrud.info('Recommendations fetched', {userId: userId, productId: productId}, req)
      return res.status(200).json({ status: 'success', data: recommendations });
    } catch (err) {
      loggerCrud.error('Error fetching recommendations', {userId: userId, productId: productId}, err);
      console.error('Error fetching recommendations', err);
      return res.status(500).json({ status: 'error', message: String(err) })
    }
  });

  return router;
};
