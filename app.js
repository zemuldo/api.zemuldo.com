'use strict';

let express = require("express");
let bodyParser = require('body-parser');
let config = require('./config/env');

let configs = config[process.env.NODE_ENV]

let app = express();

app.use(bodyParser.json());

//testAPI Route
let testAPI = require('./routes/testAPI');

app.use(testAPI);

app.listen(configs.httpPort, "0.0.0.0",function(){
    console.log("Web server running at http://localhost:"+configs.httpPort)
});