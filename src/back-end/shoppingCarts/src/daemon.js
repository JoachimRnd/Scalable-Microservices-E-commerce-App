const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');
const log = require('debug')('users-d');
const cartRoutes = require('./routes/cartRoutes');
const cartCrud = require('./utils/crud/crud-cart');

const server = express();

server.use(logger('dev'));
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: false }));

/*server.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});*/

server.use('/cart', cartRoutes(cartCrud));

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

const port = process.env.USERS_D_PORT || 80;
server.listen(port, function () {
  log(`Listening at port ${port}`);
});
