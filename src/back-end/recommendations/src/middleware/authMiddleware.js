const moment = require('moment');
const log = require('debug')('users-d');
const tokenUtils = require('../utils/tokenUtils');

function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        log('Token not provided');
        return res.status(401).json({ status: 'error', message: 'Unauthorized: Token not provided' });
    }

    const [bearer, token] = authHeader.split(' ');

    if (!token || bearer.toLowerCase() !== 'bearer') {
        log('Malformed token');
        return res.status(401).json({ status: 'error', message: 'Unauthorized: Malformed token' });
    }

    try {
        const decoded = tokenUtils.decodeToken(token);
        if (decoded.exp <= moment().unix()) {
            log('Expired token');
            return res.status(401).json({ status: 'error', message: 'Unauthorized: Expired token' });
        }
        req.userId = decoded.sub;
        next();
    } catch (err) {
        log('Failed to verify token');
        return res.status(401).json({ status: 'error', message: 'Unauthorized: Failed to verify token' });
    }
}

module.exports = authMiddleware;
