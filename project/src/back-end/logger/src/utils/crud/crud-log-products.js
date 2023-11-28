const logs = require('nano')(`${process.env.DB_URL}/products-d-logs`);

const info = (message, data) => {
    return new Promise((resolve, reject) => {
        logs.insert({ level: 'info', message, data }, (error, success) => {
            if (success) {
                console.log('success', success);
                resolve(success);
            } else {
                console.log('error', error);
                reject(error);
            }
        });
    });
};

const error = (message, data) => {
    return new Promise((resolve, reject) => {
        logs.insert({ level: 'error', message, data }, (error, success) => {
            if (success) {
                console.log('success', success);
                resolve(success);
            } else {
                console.log('error', error);
                reject(error);
            }
        });
    });
};

module.exports = {
    info,
    error,
};
