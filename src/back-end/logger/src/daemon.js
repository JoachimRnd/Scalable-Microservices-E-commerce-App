const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');
const log = require('debug')('logger-d');
const logsRoutes = require('./routes/logsRoutes');


const server = express();

server.use(logger('dev'));
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: false }));

server.use('/logger', logsRoutes());


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

console.log('Listening at port', port);

server.listen(port, function () {
  log(`Listening at port ${port}`);
});
