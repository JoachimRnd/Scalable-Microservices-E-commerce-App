const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');
const log = require('debug')('users-d');
const cron = require('node-cron');

const loggerCrud = require('./utils/crud/crud-logger');

const recommendationRoutes = require('./routes/recommendationRoutes');
const recommendationCrud = require('./utils/crud/crud-recommendation');

const server = express();

server.use(logger('dev'));
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: false }));

server.use('/recommendations', recommendationRoutes(recommendationCrud));

server.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

server.use((err, req, res, next) => {
  const message = req.app.get('env') === 'development' ? err : {};
  log(`${message}`);
  log(err);
  res.status(err.status || 500);
  res.json({
    status: 'error'
  });
});

cron.schedule('*/0.5 * * * *', async () => {
  console.log("Running generate daily recommendations");  
  try {
    recommendationCrud.generateDailyRecommendations();
    loggerCrud.info('Daily recommendations generated', {}, null)
  } catch (err) {
    loggerCrud.error('Error generating daily recommendations', {}, err);
    console.error('Error generating daily recommendations', err);
  }
});


const port = process.env.USERS_D_PORT || 80;
server.listen(port, function () {
  log(`Listening at port ${port}`);
});
