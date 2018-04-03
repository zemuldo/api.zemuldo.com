'use strict';
const os = require('os')
const cluster = require('cluster')
const numCPUs = require('os').cpus().length

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

const server = require('./server/app');
const express = require('./express/app');
const socket = require('./ws/app');

server.on('request', express);
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

server.listen(process.env.PORT, () => {
    console.info('\x1b[37m%s\x1b[0m',`Web server started at http://localhost:${process.env.PORT}`);
    console.info('\x1b[37m%s\x1b[0m',`Web Socket started at  ws://localhost:${process.env.PORT}`);
});
process.on('exit', (code) => {
    console.log("----------------------------------------App started")
    (errorCode[code])?errorCode[code].logger():console.info('\x1b[31m%s\x1b[0m',`Process error, unknown error`);
});
process.on('warning', (warning) => {
    console.log("----------------------------------------")

});
process.on('message', (message=>{
    console.log(message)
}))