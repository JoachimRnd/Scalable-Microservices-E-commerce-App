const express = require('express');
const cors = require('cors');
const logger = require('morgan');
const bodyParser = require('body-parser');
const log = require('debug')('users-d');
const productsRoutes = require('./routes/productsRoutes');
const productsCrud = require('./utils/crud/crud-products');

const server = express();
server.use(cors());


server.use(logger('dev'));
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: false }));

server.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
});

server.use('/products', productsRoutes(productsCrud));

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
