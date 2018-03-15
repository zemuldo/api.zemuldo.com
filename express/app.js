'use strict';
let path = require('path')
let fs = require('fs');
let express = require("express");
let bodyParser = require('body-parser');
let helmet = require('helmet')
let checkMe = require('cookie-session')
const compression = require('compression');
const {setCors} = require('../tools/utilities')
let app = express();

app.use(setCors);
app.use(bodyParser.json({limit: '50mb'}));
app.use(compression());
app.use(bodyParser.json());
app.use(helmet())
app.set('x-powered-by',false);
app.set('X-Powered-By',false);
app.use(helmet.ieNoOpen());
app.use(helmet.xssFilter());
app.use(helmet.noSniff());
app.use(helmet({
    frameguard: false,
    noCache:true
}));

app.use(express.static(path.join(__dirname, 'public')))

let expiryDate = new Date(Date.now() + 60 * 60 * 1000);
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
}));

let blogsRoute = require('./routes/blogs');

app.use(blogsRoute);
app.use(bodyParser.json());



// Let's create the regular HTTP request and response
app.get('/*', function(req, res) {
    res.redirect('https://zemuldo.com')
});

module.exports = app;