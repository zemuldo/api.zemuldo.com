'use strict';
let os = require('os')
console.log("----------------------------------------Starting app")
let hostDetils = {
    hostname:os.hostname(),
    type:os.type(),
    platform:os.platform(),
    uptime:os.uptime()
}
let date = new Date().toString()
console.log('\x1b[37m%s\x1b[0m',"****Staring app on ")
console.log('\x1b[37m%s\x1b[0m',JSON.stringify(hostDetils))
console.log('\x1b[36m%s\x1b[0m', date);

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

const errorCode = {
    12:{
        logger:function () {
            let date = new Date().toString()
            console.log('\x1b[31m%s\x1b[0m', 'Data base indexing failed, check database counter methods');
            console.log('\x1b[31m%s\x1b[0m', date);
            console.log("----------------------------------------")
        }
    }
}

let config = ENV[process.env.NODE_ENV]
let app = express();

app.use(bodyParser.json({limit: '50mb'}));
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


let blogsRoute = require('./routes/blogs');

app.use(blogsRoute);
wsserver.on('request', app);
wsserver.listen(config.httpPort, () => {
    console.info('\x1b[37m%s\x1b[0m',`Web server started at http://localhost:${config.httpPort}`);
    console.info('\x1b[37m%s\x1b[0m',`Web Socket started at  ws://localhost:${config.httpPort}`);
});
process.on('exit', (code) => {
    console.log("----------------------------------------App started")
    (errorCode[code])?errorCode[code].logger():console.info('\x1b[31m%s\x1b[0m',`Process error, unknown error`);
});
process.on('warning', (warning) => {
    console.log("----------------------------------------")

});