const moment = require('moment');
const log = require('debug')('users-d');
const tokenUtils = require('../utils/tokenUtils');

function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        log('Token non fourni');
        return res.status(401).json({ status: 'error', message: 'Non autorisé : Token non fourni' });
    }

    const [bearer, token] = authHeader.split(' ');

    if (!token || bearer.toLowerCase() !== 'bearer') {
        log('Token malformaté');
        return res.status(401).json({ status: 'error', message: 'Non autorisé : Token malformaté' });
    }

    try {
        const decoded = tokenUtils.decodeToken(token);

        if (decoded.exp <= moment().unix()) {
            log('Token expiré');
            return res.status(401).json({ status: 'error', message: 'Non autorisé : Token expiré' });
        }

        req.user = decoded;
        next();
    } catch (err) {
        log('Échec de la vérification du token');
        return res.status(401).json({ status: 'error', message: 'Non autorisé : Échec de la vérification du token' });
    }
}

module.exports = authMiddleware;
