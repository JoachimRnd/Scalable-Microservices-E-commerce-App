const bcrypt = require('bcryptjs');
const tokenUtils = require('../tokenUtils');
const users = require('nano')(process.env.DB_URL);

function equalPassws(usrPass, usrDbPass) {
  return bcrypt.compareSync(usrPass, usrDbPass);
}

function createUser(usrName, passw) {
  return new Promise((resolve, reject) => {
    users.insert(
      { 'passw': bcrypt.hashSync(passw, bcrypt.genSaltSync()), 'role': 'user' },
      usrName,
      (error, success) => {
        if (success) {
          resolve(tokenUtils.encodeToken(usrName, 'user'));
        } else {
          reject(new Error(`In the creation of user (${usrName}). Reason: ${error.reason}.`));
        }
      }
    );
  });
}

function getUser(usrName, passw) {
  return new Promise((resolve, reject) => {
    users.get(usrName, (error, success) => {
      if (success) {
        if (!equalPassws(passw, success.passw)) {
          reject(new Error(`Passwords (for user: ${usrName}) do not match.`));
        }
        resolve([tokenUtils.encodeToken(usrName, success.role), success.role]);
      } else {
        reject(new Error(`To fetch information of user (${usrName}). Reason: ${error.reason}.`));
      }
    });
  });
}

module.exports = {
  createUser,
  getUser,
};
