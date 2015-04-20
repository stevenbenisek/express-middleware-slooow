'use strict';

var get = require('./src/get');

module.exports = function (req, res, next) {
    var q = req.query;
    var url = q.url;
    var ttfb = Number(q.ttfb) || 0;

    var now = Date.now();
    var later = now + (ttfb * 1000);

    get(url).then(function (data) {
        var wait = Math.max(0, (later - Date.now()));
        setTimeout(function () {
            res
                .header('Content-Type', data.headers['content-type'])
                .status(data.status)
                .send(Buffer.concat(data.body));
        }, wait);
    }, next);
};
