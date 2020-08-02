  
const server = require('../server/app.js');
const WebSocket = require('ws');
const uuidv4 = require('uuid/v4');
const logger = require('../tools/logger');

const wss = new WebSocket.Server({
  server: server
});

let sessions = {};

wss.on('connection', (ws) => {
  let sessionId = uuidv4();
  sessions[sessionId] = {
    id: sessionId,
    date: new Date(),
  };

  ws.sessionId = sessionId;

  ws.on('message', function (_msg) {
    return _msg;
  });
  ws.on('error', (err) => {
    logger.error(err);
  });
  ws.send(JSON.stringify({
    type: 'sessionId',
    msg: sessionId
  }));
});

module.exports = wss;