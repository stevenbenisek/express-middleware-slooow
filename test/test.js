'use strict';

var assert = require('assert');
var get = require('../src/get');
var Promise = require('es6-promise').Promise;
var server = require('./server');

var NOT_STRING_TEST = {
    'Array': [1, 2, 3],
    'Boolean': true,
    'Function': function () {},
    'Number': 3,
    'Object': { a: 1 },
    'RegExp': /test/g
};

var NOT_NUMBER_TEST = {
    'Array': [1, 2, 3],
    'Boolean': true,
    'Function': function () {},
    'Object': { a: 1 },
    'RegExp': /test/g,
    'String': 'a'
};

var FORMATS = [
    '.css',
    '.gif',
    '.html',
    '.jpg',
    '.js',
    '.png',
    '.svg'
];

var MAX_TTFB = 4;

var makeAssetUrl = (function () {
    var staticUrl = server + '/static/';
    var ttfbUrl = server + '/slooow?';

    return function (asset, ttfb) {
        return ttfbUrl + [
            'url=' + staticUrl + asset,
            'ttfb=' + ttfb
        ].join('&');
    };
})();

function assert404 (response) {
    assert.equal(
        response.status,
        404
    );
}

function assertSucces (startTime, ttfb) {
    ttfb = Number(ttfb) || 0;
    assert(true, (startTime + (ttfb * 1000)) >= Date.now());
}

describe('express-middleware-slooow', function () {

    this.timeout(MAX_TTFB * 1000);

    var now;
    var ttfb;

    beforeEach(function () {
        ttfb = 0;
        now = Date.now();
    });

    describe('url', function () {
        describe('?url=${}', function () {
            it('should return a 404 if the url is not defined', function (done) {
                get(makeAssetUrl()).then(function (response) {
                    assert404(response);
                    done();
                });
            });
        });

        describe('?url=${' + Object.keys(NOT_STRING_TEST).join('|') + '}', function () {
            it('should return a 404 if the url is not a String', function (done) {
                Promise.all(
                    Object.keys(NOT_STRING_TEST).map(function (key) {
                        var data = NOT_STRING_TEST[key];
                        return get(makeAssetUrl(data)).then(function (response) {
                            assert404(response);
                        });
                    })
                ).then(function () {
                    done();
                });
            });
        });

        describe('?url=${String}', function () {
            it('should return a 404 if the url endpoint doesn\'t exist', function (done) {
                get(makeAssetUrl('bogus')).then(function (response) {
                    assert404(response);
                    done();
                });
            });

            it('should get http resource with a default ttfb delay of 0 seconds', function (done) {
                Promise.all(
                    FORMATS.map(function (format) {
                        now = Date.now();
                        return get(makeAssetUrl('test' + format, ttfb)).then(function () {
                            assertSucces(now, ttfb);
                        });
                    })
                ).then(function () {
                    done();
                });
            });
        });
    });

    describe('ttfb', function () {
        describe('?url=${String}&ttfb=${' + Object.keys(NOT_NUMBER_TEST).join('|') + '}', function () {
            it('should get http resource with the default ttfb delay, if ttfb is not a Number', function (done) {
                Promise.all(
                    Object.keys(NOT_NUMBER_TEST).map(function (key) {
                        now = Date.now();
                        ttfb = NOT_NUMBER_TEST[key];
                        return get(makeAssetUrl('test.css', ttfb)).then(function () {
                            assertSucces(now, ttfb);
                        });
                    })
                ).then(function () {
                    done();
                });
            });
        });

        describe('?url=${String}&ttfb=${Number}', function () {
            beforeEach(function () {
                ttfb = Math.floor((Math.random() * MAX_TTFB) * 100) / 100;
                now = Date.now();
            });

            FORMATS.forEach(function (format) {
                it('should get ' + format + ' with the defined ttfb delay', function (done) {
                    get(makeAssetUrl('test' + format, ttfb)).then(function () {
                        assertSucces(now, ttfb);
                        done();
                    });
                });
            });
        });
    });
});
