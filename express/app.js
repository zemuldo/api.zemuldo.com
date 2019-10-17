
let path = require('path');
let express = require('express');
let bodyParser = require('body-parser');
let helmet = require('helmet');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const {rootPathResponse} = require('./definitions/responses');

const app = express();

app.use(require('./plugs/cors'));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(compression());
app.use(helmet());
app.set('x-powered-by', false);
app.set('X-Powered-By', false);
app.use(helmet.ieNoOpen());
app.use(helmet.xssFilter());
app.use(helmet.noSniff());
app.use(helmet({
  frameguard: false,
  noCache: true
}));
// parse cookies
app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());
app.use(require('./plugs/auth'));

passport.serializeUser(function (user, cb) {
  cb(null, user);
});

passport.deserializeUser(function (obj, cb) {
  cb(null, obj);
});

app.use(express.static(path.join(__dirname, 'public')));

app.use('/posts', require('./routes/posts'));
app.use('/user', require('./routes/user'));

// Let's create the regular HTTP request and response
app.get('/', function (req, res) {
  res.send(rootPathResponse);
});
app.get('/*', function (req, res) {
  res.status(404).send({ errors: [{ errorType: 'NOT_FOUND', errorMessage: 'Resource not found' }]});
});

module.exports = app;