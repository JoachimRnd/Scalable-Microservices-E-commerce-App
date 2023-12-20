const express = require('express');
const router = express.Router();
const log = require('debug')('recommendations-d');
const authMiddleware = require('../middleware/authMiddleware');

const loggerCrud = require('../utils/crud/crud-logger');

module.exports = (recommendationCrud) => {

  router.get('/', authMiddleware, (req, res) => {
    const userId = req.userId;

    recommendationCrud.getRecommendations(userId) // todo exemple
      .then(recommendations => {
        loggerCrud.info('Fetched recommendations', { userId, recommendations }, req)
        .catch((err) => {
          console.log('error', err);
        });
        return res.status(200).json({ status: 'success', data: recommendations })
      })
      .catch((err) => {
        loggerCrud.error('Error fetching recommendations', { userId }, req)
        .catch((err) => {
          console.log('error', err);
        });
        return res.status(500).json({ status: 'error', message: String(err) })
      });
  });

  return router;
};
