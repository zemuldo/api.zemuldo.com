const server = require('../server/app.js');
const processRequest = require('./intents');
const WebSocket = require('ws');
const uuidv4 = require('uuid/v4');

const wss = new WebSocket.Server({server: server});

let sessions = {};

wss.on('connection', (ws) => {
  let sessionId = uuidv4();

  setTimeout(function () {
      if(!sessions[sessionId]){
          if(ws.readyState===1){
              ws.send(JSON.stringify({"type":"bot","msg":"Hi its good to have you here, You can find more info about me through my profile bot."}));
          }
      }
      else {
          console.log(sessions)
      }
  },8000);

  ws.on('message', function (msg) {
          sessions[sessionId] = {
              id:sessionId,
              date:new Date()
          };
          if(JSON.parse(msg).sessionId && !sessions[JSON.parse(msg).sessionId].messages){
              sessions[JSON.parse(msg).sessionId].messages=true
          }
          processRequest(msg)
              .then(function (answer) {
                  if(ws.readyState===1){
                      ws.send(JSON.stringify({type: 'bot', msg: answer}))
                  }
              })
              .catch(function (err) {
                  console.log(err)
              })
  }

  );
  ws.on('error',(err)=>{
    console.log(err)
  });
  ws.send(JSON.stringify({type: 'sessionId', msg: sessionId}));
});

module.exports = wss;
