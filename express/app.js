'use strict';
let path = require('path')
let express = require("express");
let bodyParser = require('body-parser');
let helmet = require('helmet')
const compression = require('compression');
const setCors = require('../tools/set_cors')
const cookieParser = require('cookie-parser')

const app = express();

app.use(setCors);
app.use(bodyParser.json({ limit: '50mb' }));
app.use(compression());
app.use(bodyParser.json());
app.use(helmet())
app.set('x-powered-by', false);
app.set('X-Powered-By', false);
app.use(helmet.ieNoOpen());
app.use(helmet.xssFilter());
app.use(helmet.noSniff());
app.use(helmet({
    frameguard: false,
    noCache: true
}));

app.use(cookieParser())

app.use(express.static(path.join(__dirname, 'public')))

app.use('/posts', require('./routes/posts'))


// Let's create the regular HTTP request and response
app.get('/', function (req, res) {
    res.send({ status: 'Ok' })
});
app.get('/*', function (req, res) {
    res.status(404).send({ errors: [{ errorType: "NOT_FOUND", errorMessage: "Resource not found" }]})
});

module.exports = app;