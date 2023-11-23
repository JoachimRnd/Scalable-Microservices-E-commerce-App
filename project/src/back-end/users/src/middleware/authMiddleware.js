const moment = require('moment');
const log = require('debug')('users-d');
const tokenUtils = require('../utils/tokenUtils');

function authMiddleware(req, res, next) {
    console.log("authMiddleware")
    console.log(req)
    const token = req.headers.authorization;
    console.log("headers")
    console.log(req.headers)

    if (!token) {
        log('Token non fourni');
        return res.status(401).json({ status: 'error', message: 'Non autorisé : Token non fourni' });
    }

    try {
        const decoded = tokenUtils.decodeToken(token);

        if (decoded.exp <= moment().unix()) {
            log('Token expiré');
            return res.status(401).json({ status: 'error', message: 'Non autorisé : Token expiré' });
        }

        req.user = decoded;
        console.log("DECODE CEST BON")
        next();
    } catch (err) {
        log('Échec de la vérification du token');
        return res.status(401).json({ status: 'error', message: 'Non autorisé : Échec de la vérification du token' });
    }
}

module.exports = authMiddleware;
