const info = (body, logs) => {
    return new Promise((resolve, reject) => {
        logs.insert({ level: 'info', message: body.message, data: body.data, request_time_ms: body.request_time_ms }, (error, success) => {
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

const error = (body, logs) => {
    return new Promise((resolve, reject) => {
        logs.insert({ level: 'error', message: body.message, data: body.data, request_time_ms: body.request_time_ms}, (error, success) => {
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

const userInfo = (message, logs, log_id, id, database_name) => {
    return new Promise((resolve, reject) => {
        logs.insert({ message, log_id, id, database_name }, (error, success) => {
            if (success) {
                console.log('success', success);
                resolve(success);
            } else {
                console.log('error', error);
                reject(error);
            }
        });
    });
}

module.exports = {
    info,
    error,
    userInfo
};