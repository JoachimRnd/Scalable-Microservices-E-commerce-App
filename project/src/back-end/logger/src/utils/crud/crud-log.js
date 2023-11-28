const e = require("express");

const info = (body, logs) => {
    return new Promise((resolve, reject) => {
        console.log('body', body);
        let userId = '';
        if (!body.data.userId) {
            userId = 'unknown';
        } else {
            userId = body.data.userId;
        }
        logs.insert({ level: 'info', message: body.message, userId, timestamp: body.startTime, data: body.data, request_time_ms: body.request_time_ms }, (error, success) => {
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
    let userId = '';
    if (!body.data.userId) {
        userId = 'unknown';
    } else {
        userId = body.data.userId;
    }
    return new Promise((resolve, reject) => {
        logs.insert({ level: 'error', message: body.message, userId ,timestamp: body.startTime, data: body.data, request_time_ms: body.request_time_ms}, (error, success) => {
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

const getUserInfo = (username, logs) => {
    console.log('username', username);
    return new Promise((resolve, reject) => {
        logs.view('logs', 'getLogsByUserId', { keys: [username], include_docs: true }, (error, success) => {
            if (success) {
                console.log('success', success);
                const data = success.rows.map(row => row.doc);
                console.log('data', data);
                resolve(data);
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
    getUserInfo
};