const bcrypt = require('bcryptjs')
const tku = require('./en-de-coders')

var users = {}

function equalPassws (usrPass, usrDbPass) {
  return bcrypt.compareSync(usrPass, usrDbPass)
}

function createUser (usrName, passw) {
  return new Promise((resolve, reject) => {
    if (!users[usrName]) {
      users[usrName] = {
        hashedPassw: bcrypt.hashSync(passw, bcrypt.genSaltSync())
      }
      resolve(tku.encodeToken(usrName))
    } else {
      reject(new Error(`User (${usrName}) already exist.`))
    }
  })
}

function getUser (usrName, passw) {
  return new Promise((resolve, reject) => {
    if (users[usrName]) {
      if (!equalPassws(passw, users[usrName].hashedPassw)) {
        reject(new Error(`User (${usrName}) password does not match`))
      }
      resolve(tku.encodeToken(usrName))
    } else {
      reject(new Error(`User (${usrName}) does not exist`))
    }
  })
}

function createCheckout (checkout) {
  console.log("create checkout in crud js")
  console.log(checkout)
  
  /*return new Promise((resolve, reject) => {
    users.insert(
      // 1st argument of nano.insert()
      { 'passw': bcrypt.hashSync(passw, bcrypt.genSaltSync()) },
      usrName, // 2nd argument of nano.insert()
      // callback to execute once the request to the DB is complete
      (error, success) => {
        if (success) {
          resolve(tku.encodeToken(usrName))
        } else {
          reject(
            new Error(`In the creation of user (${usrName}). Reason: ${error.reason}.`)
          )
        }
      }
    )
  })*/
}


module.exports = {
  createUser,
  getUser,
  createCheckout
}
