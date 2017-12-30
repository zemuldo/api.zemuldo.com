const apiai = require("apiai")(process.env.APIAI_CLIENT_TOKEN);
const uuidv4 = require('uuid/v4');

// include and merge all intents:
const date = require('./date');
const time = require('./time');
const intents = Object.assign({}, date, time);

// Process intents at API.AI, and get action and parameters
const callApiAi = (text, sessionId, tz) => new Promise((resolve, reject) => {
  const request = apiai.textRequest(text, { sessionId: sessionId, timezone: tz });

  request.on('response', response => resolve(response));
  request.on('error', error => reject(error));
  request.end();
});

// Process the action
const doIntent = (response, tz) => {
  const { parameters, action, fulfillment } = response.result;

  return new Promise((resolve, reject) => {
    if (intents[action]) {
      return resolve(intents[action](parameters, tz));
    } else if (fulfillment.speech) {
      return resolve(fulfillment.speech);
    }
    return reject(handleUnknownAnswer());
  });
}

const handleUnknownAnswer = (err) => {
  const msgs = [
    'Didn\'t quite catch what you said?',
    'Donno',
    'Can you try again?',
    'Sorry, can\'t help you with that?'
  ];

  return msgs[~~(Math.random() * msgs.length)];
};

let   processRequest = (msg)=>{
    let input = null;
  return new Promise(function (resolve,reject) {
      input = JSON.parse(msg);
      if(!input.sessionId){
        reject({err:'no session id'})
      }
      resolve(JSON.parse(msg))
  })
      .then(function (input) {
          const sessionId = input.sessionId || uuidv4();
          const tz = input.tz;
          console.log(input)
          return callApiAi(input.msg, sessionId, tz)
      })
      .then(function (res) {
          return doIntent(res, input.tz)
      })
      .then(function (answer) {
        console.log(answer)
          return answer
      })
      .catch(function (err) {
          return handleUnknownAnswer(err)
      })
}

module.exports = processRequest;
