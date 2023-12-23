const logger = require('axios')

const gateway = `http://${process.env.GATEWAY_HOST}`

if (!process.env.GATEWAY_HOST) {
    throw new Error('GATEWAY_HOST is not set');
}

const computeTimeDifference = (req) => {
    const now = new Date();
    const startTime = new Date(req._startTime);
    const differenceInMilliseconds = now - startTime;
    return differenceInMilliseconds;
}

const info = (message, data, req) => {
    return new Promise((resolve, reject) => {
        if (req) {
            const timeDifference = computeTimeDifference(req);
            logger.post(`${gateway}/logger/recommendations/info`, { message, data, startTime: req._startTime, request_time_ms : timeDifference})
                .then((success) => {
                    resolve(success);
                })
                .catch((error) => {
                    reject(error);
                });
        } else {
            logger.post(`${gateway}/logger/recommendations/info`, { message, data})
                .then((success) => {
                    resolve(success);
                })
                .catch((error) => {
                    reject(error);
                });
        }
        
    });
}

const error = (message, data, req) => {
    return new Promise((resolve, reject) => {
        const timeDifference = computeTimeDifference(req);
        logger.post(`${gateway}/logger/recommendations/error`, { message, data, startTime: req._startTime, request_time_ms : timeDifference })
            .then((success) => {
                resolve(success);
            })
            .catch((error) => {
                reject(error);
            });
    });
}

module.exports = {
    info,
    error,
};