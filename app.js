'use strict';
const os = require('os')
const cluster = require('cluster')
const numCPUs = require('os').cpus().length
const logger = require('./tools/logger')

logger.info('Starting Zemuldo API Backend')
let hostDetils = {
    hostname:os.hostname(),
    type:os.type(),
    platform:os.platform(),
    uptime:os.uptime()
}
let date = new Date().toString()
logger.info(hostDetils)

const server = require('./server/app');
const express = require('./express/app');
const socket = require('./ws/app');

server.on('request', express);
let ENV = require('./config/env');

if(!ENV.jwtKey) throw Error('jwt key cant be null')
const errorCode = {
    12:{
        logger:function () {
            let date = new Date().toString()
            logger.error({status:'Data base indexing failed, check database counter methods',date:date})
        }
    }
}

let config = ENV[process.env.NODE_ENV]

server.listen(process.env.PORT, () => {
    logger.info(`Web server started at http://localhost:${process.env.PORT}`);
    logger.info(`Web Socket started at  ws://localhost:${process.env.PORT}`);
});
process.on('exit', (code) => {
    logger.info({status:`App exited with an error ${code}`,code:code});
});
process.on('warning', (warning) => {
    logger.warn(warning)

});
process.on('message', (message=>{
    logger.info(message)
}))