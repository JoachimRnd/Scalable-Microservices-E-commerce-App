
const info = (body, logs) => {
    return new Promise((resolve, reject) => {
        let userId = '';
        if (!body.data.userId) {
            userId = 'unknown';
        } else {
            userId = body.data.userId;
        }
        logs.insert({ level: 'info', message: body.message, userId, timestamp: body.startTime, data: body.data, request_time_ms: body.request_time_ms }, (error, success) => {
            if (success) {
                resolve(success);
            } else {
                reject(error);
            }
        });
    });
};

const error = (body, logs) => {
    let userId = '';
    if (!body.data.userId) {
        userId = 'unknown';
    } else {
        userId = body.data.userId;
    }
    return new Promise((resolve, reject) => {
        logs.insert({ level: 'error', message: body.message, userId ,timestamp: body.startTime, data: body.data, request_time_ms: body.request_time_ms}, (error, success) => {
            if (success) {
                resolve(success);
            } else {
                reject(error);
            }
        });
    });
};

const getUserInfo = (userId, logs) => {
    return new Promise((resolve, reject) => {
        logs.view('logs', 'getLogsByUserId', { key: userId, include_docs: true }, (err, body) => {
            if (!err) {
                const data = body.rows.map(row => row.doc);
                resolve(data);
            } else {
                reject(new Error(`Error getting logs by user ID. Reason: ${err.reason}.`));
            }
        });
    });
};

module.exports = {
    info,
    error,
    getUserInfo
};