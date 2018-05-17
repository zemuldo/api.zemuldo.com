const winston = require('winston');
const config = winston.config;
const logger = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)({
      timestamp: function() {
        return new Date().toISOString();
      },
      formatter: function(options) {
        return options.timestamp() + ' ' +
          config.colorize(options.level, options.level.toUpperCase()) + ' ' +
          (options.message ? options.message : '') +
          config.colorize(options.level,(options.meta && Object.keys(options.meta).length ? '\n\t'+ JSON.stringify(options.meta) : '' ))
      },
      prettyPrint: true
    })
  ]
});
winston.addColors({
    error: 'red',
    warn: 'yellow',
    info: 'blue',
    debug: 'green'
});

module.exports = {
    error: (mess) => {

        logger.error('error', { mess: mess, worker: { pid: process.pid } });

    },
    warn: (mess) => {

        logger.warn('warning', { mess: mess, worker: { pid: process.pid } });
    },
    success: (mess) => {

        logger.info('success', { mess: mess, worker: { pid: process.pid } });

    },
    system: (mess) => {

        logger.log('SYSTEM', { mess: mess, worker: { pid: process.pid } });

    },
    fail: (mess) => {

        logger.log('FAILED', { mess: mess, worker: { pid: process.pid } });

    },
    internal: (mess) => {

        logger.info('INTERNAL', { mess: mess, worker: { pid: process.pid } });
    },
    info: (mess) => {

        logger.info('INTERNAL', { mess: mess, worker: { pid: process.pid } });
    },
    status: (mess) => {

        logger.info('STATUS', { mess: mess, worker: { pid: process.pid } });

    },
    timeout: (mess) => {

        logger.error('ERROR', { mess: mess, worker: { pid: process.pid } });
    },
    sql: (mess) => {

        logger.info('DB', { mess: mess, worker: { pid: process.pid } });

    },
    db: (mess) => {

        logger.info(`DB`, { task:mess.task || 'unspcified', query:mess.query, mess: mess.mess, worker: { pid: process.pid } });

    },
    bus: (mess,bus) => {

        logger.info(`${bus.vehicleID}`, { mess: mess, bus:bus, worker: { pid: process.pid } });

    },
    warn:(mess)=>{
        logger.warn( { mess: mess,worker: { pid: process.pid } })
    }
}
