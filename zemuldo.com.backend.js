'use strict';
const dotenv = require('dotenv').config({
    path: process.env.NODE_ENV === 'test' ? 'test.env' :
        (process.env.NODE_ENV === 'production' ? 'production.env' : '.env')
});
let express = require("express");
let bodyParser = require('body-parser');
let helmet = require('helmet')
let checkMe = require('cookie-session')
const compression = require('compression');
const wsserver = require('./ws');
//let wss = require('./ws/websocket')
let ENV = require('./config/env');

let config = ENV[process.env.NODE_ENV]
let app = express();

app.use(compression());
app.use(bodyParser.json());
app.use(helmet())
app.set('x-powered-by',false)
app.set('X-Powered-By',false)
app.use(helmet.ieNoOpen())
app.use(helmet.xssFilter())
app.use(helmet.noSniff())
app.use(helmet({
    frameguard: false,
    noCache:true
}))
let expiryDate = new Date(Date.now() + 60 * 60 * 1000) // 1 hour
app.use(checkMe({
    name: 'checkMe',
    keys: ['themati#@tripple26=n26gohb()@#$$#$THF$%^$FGDFRFU', '#$THF$%^$FGDFRFU26gohb()@#i#@tripple26='],
    cookie: {
        secure: true,
        httpOnly: true,
        domain: 'zemuldo.com',
        path: '/',
        expires: expiryDate
    }
}))

let athRoute = require('./routes/auth');
let fetchRoute = require('./routes/fetch');
let blogsRoute = require('./routes/blogs');
let analyticsRoute = require('./routes/analytics');


app.use(athRoute);
app.use(fetchRoute);
app.use(blogsRoute);
app.use(analyticsRoute);
wsserver.on('request', app);
wsserver.listen(config.httpPort, () => {
    console.info(`Web server started at http://localhost:${config.httpPort}`);
    console.info(`Web Socket started at  ws://localhost:${config.httpPort}`);
});