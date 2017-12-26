'use strict';

let WSServer = require('ws').Server;
let wss_http_server = require('http').createServer();
let app = require('../http/app');
let processRequest = require('./intents')

// Create web socket server on top of a regular http server
let wss = new WSServer({

    server: wss_http_server
});

// Also mount the app here
wss_http_server.on('request', app);

wss.on('connection', function connection(ws) {

    ws.on('message', function incoming(message) {

        console.log(`received: ${message}`);
        processRequest(message)
            .then(function (o) {
                ws.send(JSON.stringify({
                    answer: o
                }));
            })
            .catch(function (e) {
                ws.send(JSON.stringify({
                    answer: e
                }));
            })
    });
});

module.exports = wss_http_server;