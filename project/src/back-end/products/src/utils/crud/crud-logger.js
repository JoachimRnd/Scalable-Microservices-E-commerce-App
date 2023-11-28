const logger = require('axios')

const gateway = `http://${process.env.GATEWAY_HOST}`
console.log('gateway', gateway);

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
        const timeDifference = computeTimeDifference(req);
        console.log('Time difference in milliseconds: ', timeDifference);
        logger.post(`${gateway}/logger/products/info`, { message, data, request_time_ms : timeDifference})
            .then((success) => {
                resolve(success);
            })
            .catch((error) => {
                reject(error);
            });
    });
}

const error = (message, data, req) => {
    return new Promise((resolve, reject) => {
        const timeDifference = computeTimeDifference(req);
        console.log('Time difference in milliseconds: ', timeDifference);
        logger.post(`${gateway}/logger/products/error`, { message, data, request_time_ms : timeDifference })
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