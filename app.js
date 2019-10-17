
const os = require('os');
const logger = require('./tools/logger');

require('./db/mongoose');
require('./ws/app.js');
require('dotenv').config();

logger.info('Starting Zemuldo API');
let hostDetils = {
  hostname: os.hostname(),
  type: os.type(),
  platform: os.platform(),
  uptime: os.uptime()
};
logger.info(hostDetils);

const server = require('./server/app');
const express = require('./express/app');

server.on('request', express);

server.listen(process.env.PORT, () => {
  logger.info(`Web server started at http://localhost:${process.env.PORT}`);
  logger.info(`Web Socket started at  ws://localhost:${process.env.PORT}`);
});
process.on('exit', (code) => {
  logger.info({status: `App exited with an error ${code}`,code: code});
});
process.on('warning', (warning) => {
  logger.warn(warning);

});
process.on('message', (message=>{
  logger.info(message);
}));

module.exports = server;