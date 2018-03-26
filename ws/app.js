const server = require('../server/app.js');
const processRequest = require('./intents');
const WebSocket = require('ws');
const uuidv4 = require('uuid/v4');
const {
    titles
} = require('../db/mongo').collections;
const {
    topics
} = require('../config/env')

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

    ws.sessionId = sessionId

    setTimeout(function () {
        if (!sessions[sessionId].message) {
            if (ws.readyState === 1) {
                ws.send(JSON.stringify({
                    pups: 'bot',
                    type: 'bot',
                    msg: 'Hi its good to have you here, You can find more info about me through my profile bot.'
                }));
                sessions[ws.sessionId].message = true
            }
        } else {
            //console.log(sessions)
        }
    }, 30000);

    titles.find().limit(20).toArray()
        .then(o=>{
            ws.send(JSON.stringify({
                type: 'blogs',
                pups: 'blogs',
                msg: o
            }))
        })
        .catch(e=>{

        })

    ws.on('message', function (msg) {
        console.log(sessions[ws.sessionId])
        let o = JSON.parse(msg);
        if(o.pups==='chat'){
            sessions[ws.sessionId].message = true
        }
        switch (o.pups) {
            case 'chat':
                processRequest(msg)
                    .then(function (answer) {
                        if (ws.readyState === 1) {
                            ws.send(JSON.stringify({
                                type: 'bot',
                                pups: 'bot',
                                msg: answer
                            }))
                        }
                    })
                    .catch(function (err) {
                        console.log(err)
                    });
                break;
            case 'exploreBlogs':
                titles.find().limit(10).toArray()
                    .then(function (o) {
                        ws.send(JSON.stringify({
                            type: 'exploreBlogs',
                            pups: 'exploreBlogs',
                            msg: o
                        }))
                    })
                    .catch(function () {

                    })
                break;
            case 'topicDetails':
                for (let i = 0; i < topics.length; i++) {
                    titles.find({topics: topics[i].key}).count()
                        .then(function (n) {
                            if (n > 0) {
                                ws.send(JSON.stringify({
                                    type: 'topicDetails',
                                    pups: 'topicDetails',
                                    msg: [{
                                        key: topics[i].key,
                                        blogs: n
                                    }]
                                }))
                            }
                        })
                        .catch(function (e) {
                            console.log(e)
                        })
                }
                break;
            case 'blog':
                titles.find().limit(30).toArray()
                    .then(o=>{
                        ws.send(JSON.stringify({
                            type: 'blogs',
                            pups: 'blogs',
                            msg: o
                        }))
                    })
                    .catch(e=>{

                    })
                break;

        }
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