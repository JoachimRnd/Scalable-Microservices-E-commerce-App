const express = require('express');
const router = express.Router();
const log = require('debug')('users-d');

module.exports = (userCrud) => {
  router.post('/', (req, res) => {
    const usrName = req.body.username;
    const usrPassw = req.body.password;
    userCrud.createUser(usrName, usrPassw)
      .then((token) => res.status(200).json({ status: 'success', token }))
      .catch((err) => res.status(409).json({ status: 'error', message: String(err) }));
  });

  router.get('/:username/:password', (req, res) => {
    const usrName = req.params.username;
    const passw = req.params.password;
    userCrud.getUser(usrName, passw)
      .then(([token, role]) => res.status(200).json({ status: 'success', data: { token, role } }))
      .catch((err) => res.status(404).json({ status: 'error', message: String(err) }));
  });
  return router;
};
