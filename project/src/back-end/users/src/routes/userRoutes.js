const express = require('express');
const router = express.Router();
const log = require('debug')('users-d');

const loggerCrud = require('../utils/crud/crud-logger');

module.exports = (userCrud) => {
  router.post('/', (req, res) => {
    const usrName = req.body.username;
    const usrPassw = req.body.password;
    userCrud.createUser(usrName, usrPassw)
      .then((token) => {
        loggerCrud.info('User created', { username: usrName, password: usrPassw }, req)
        .catch((err) => {
          console.log('error', err);
        });
        return res.status(200).json({ status: 'success', token })
      })
      .catch((err) => {
        loggerCrud.error('Error while creating user', { username: usrName, password: usrPassw }, req)
        .catch((err) => {
          console.log('error', err);
        });
        return res.status(409).json({ status: 'error', message: String(err) })
      });
    }
  );

  router.get('/:username/:password', (req, res) => {
    const usrName = req.params.username;
    const passw = req.params.password;
    userCrud.getUser(usrName, passw)
      .then(([token, role]) => {
        loggerCrud.info('User logged in', { username: usrName, password: passw, role }, req)
        .catch((err) => {
          console.log('error', err);
        });
        return res.status(200).json({ status: 'success', data: { token, role } })
        })
      .catch((err) => {
        loggerCrud.error('Error while loggin in', { username: usrName, password: passw }, req)
        .catch((err) => {
          console.log('error', err);
        });
        return res.status(404).json({ status: 'error', message: String(err) })
        });
  });
  return router;
};
