let express = require('express');
const spdy = require('spdy')
const fs = require('fs')
let path = require('path');
let  app = express();
let bodyParser = require('body-parser');
let helmet = require('helmet')
let checkMe = require('cookie-session')
const options = {
    key: fs.readFileSync(__dirname + '/keys/server.key'),
    cert: fs.readFileSync(__dirname + '/keys/server.crt')
};

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

app.get('/sw.js', function(req, res) {
    res.sendFile(path.join(__dirname, 'public', 'sw.js'));
});
app.get('/manifest.json', function(req, res) {
    res.sendFile(path.join(__dirname, 'public', '/manifest.json'));
});
app.get('*.js', function(req, res, next) {
    req.url = req.url + '.gz';
    res.set('Content-Encoding', 'gzip');
    res.set('Content-Type', 'text/javascript');
    next();
});
app.get('*.css', function(req, res, next) {
    req.url = req.url + '.gz';
    res.set('Content-Encoding', 'gzip');
    res.set('Content-Type', 'text/css');
    next();
});
let expiryDate = new Date(Date.now() + 60 * 60 * 1000) // 1 hour
app.use(checkMe({
    name: 'session',
    keys: ['themati#@tripple26=n26gohb()@#$$#$THF$%^$FGDFRFU', '#$THF$%^$FGDFRFU26gohb()@#i#@tripple26='],
    cookie: {
        secure: true,
        httpOnly: true,
        domain: 'photos.zemuldo.com',
        path: '/',
        expires: expiryDate
    }
}))
app.use(function(req, res, next) {
    if(req.url[req.url.length-1]==='/' && req.url!=='/' ){
        res.redirect(req.url.slice(0,req.url.length-1))
    }
    else {
        next();
    }
});
app.use(express.static(path.join(__dirname, 'build')));
app.use(function(req, res, next) {
    res.locals.ua = req.get('User-Agent');
    next();
});
app.get("/*", async function (req, res) {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

(process.env.NODE_ENV ==='live' || process.env.NODE_ENV ==='production')?
    spdy
        .createServer(options, app)
        .listen(process.env.PORT, (error) => {
            if (error) {
                console.error(error)
                return process.exit(1)
            } else {
                console.info('\x1b[37m%s\x1b[0m',`Photos App Started on https://localhost:${process.env.PORT}`);
            }
        }):
    app.listen(process.env.PORT, () => {
        console.info('\x1b[37m%s\x1b[0m',`Photos App Started on http://localhost:${process.env.PORT}`);
    })