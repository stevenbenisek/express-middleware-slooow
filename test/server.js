'use strict';

var express = require('express');
var ip = require('ip');
var port = process.env.PORT || 8080;
var server = express();
var slooow = require('../index.js');
var base = 'http://' + ip.address() + ':' + port;

// Jade template
server.set('views', __dirname);
server.set('view engine', 'jade');
server.set('view options', { basedir: process.env.__dirname})

// Static resources
server.use('/static', express.static(__dirname + '/resources'));

// slooow
server.use('/slooow', slooow);

// Test page
server.get('/', function (req, res) {
    res.render('test', { base: base });
});

// Serve
server.listen(port);

console.log('Serving at: ' + base);

module.exports = base;

