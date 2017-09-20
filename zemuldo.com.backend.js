'use strict';

let express = require("express");
let bodyParser = require('body-parser');
let helmet = require('helmet')
let checkMe = require('cookie-session')
let config = require('./config/env');

let configs = {port:8090}

let app = express();

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
app.get('/',(req,res)=>{
    res.send('hello')
})
let expiryDate = new Date(Date.now() + 60 * 60 * 1000) // 1 hour
app.use(checkMe({
    name: 'session',
    keys: ['themati#@tripple26=n26gohb()@#$$#$THF$%^$FGDFRFU', '#$THF$%^$FGDFRFU26gohb()@#i#@tripple26='],
    cookie: {
        secure: true,
        httpOnly: true,
        domain: 'zemuldo.com',
        path: '/',
        expires: expiryDate
    }
}))

let route = require('./routes');

app.use(route);

app.listen(configs.port, "0.0.0.0",function(){
    console.log("Web server running at http://localhost:"+configs.port)
});