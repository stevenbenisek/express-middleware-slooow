'use strict';

var Promise = require('es6-promise').Promise;
var request = require('request');

module.exports = function (url) {
    return new Promise(function (resolve, reject) {
        var body = [];
        request
            .get(url, {
                pool: false
            })
            .on('data', function (chunk) {
                body.push(chunk);
            })
            .on('response', function (response) {
                var statusCode = response.statusCode;
                resolve({
                    body: body,
                    headers: response.headers,
                    status: response.statusCode
                });
            })
            .on('error', function (error) {
                reject(error);
            });
    });
}
