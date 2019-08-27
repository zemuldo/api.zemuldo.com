  
const server = require('../server/app.js');
const WebSocket = require('ws');
const uuidv4 = require('uuid/v4');

const wss = new WebSocket.Server({
    server: server
});

let sessions = {};

wss.on('connection', (ws) => {
    console.log("New Connection")
    let sessionId = uuidv4();
    sessions[sessionId] = {
        id: sessionId,
        date: new Date(),
    };

    ws.sessionId = sessionId

    ws.on('message', function (msg) {
        console.log("new message")
    });
    ws.on('error', (err) => {
        console.log(err)
    });
    ws.send(JSON.stringify({
        type: 'sessionId',
        msg: sessionId
    }));
});

module.exports = wss;