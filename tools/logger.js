const winston = require('winston');
const config = winston.config;
const log = process.env.NODE_ENV !== 'test';
const logger = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)({
      timestamp: function () {
        return new Date().toISOString();
      },
      formatter: function (options) {
        return options.timestamp() + ' ' +
          config.colorize(options.level, options.level.toUpperCase()) + ' ' +
          (options.message ? options.message : '') +
          config.colorize(options.level, (options.meta && Object.keys(options.meta).length ? '\n\t' + JSON.stringify(options.meta) : ''));
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
    if (!log) return;

    logger.error('error', { mess: mess, worker: { pid: process.pid } });

  },
  warn: (mess) => {
    if (!log) return;

    logger.warn('warning', { mess: mess, worker: { pid: process.pid } });
  },
  success: (mess) => {
    if (!log) return;

    logger.info('success', { mess: mess, worker: { pid: process.pid } });

  },
  system: (mess) => {
    if (!log) return;

    logger.log('SYSTEM', { mess: mess, worker: { pid: process.pid } });

  },
  fail: (mess) => {
    if (!log) return;

    logger.log('FAILED', { mess: mess, worker: { pid: process.pid } });

  },
  internal: (mess) => {
    if (!log) return;

    logger.info('INTERNAL', { mess: mess, worker: { pid: process.pid } });
  },
  info: (mess) => {
    if (!log) return;

    logger.info('INTERNAL', { mess: mess, worker: { pid: process.pid } });
  },
  status: (mess) => {
    if (!log) return;

    logger.info('STATUS', { mess: mess, worker: { pid: process.pid } });

  },
  timeout: (mess) => {
    if (!log) return;

    logger.error('ERROR', { mess: mess, worker: { pid: process.pid } });
  },
  sql: (mess) => {
    if (!log) return;

    logger.info('DB', { mess: mess, worker: { pid: process.pid } });

  },
  db: (mess) => {
    if (!log) return;

    logger.info('DB', { task: mess.task || 'unspcified', query: mess.query, mess: mess.mess, worker: { pid: process.pid } });

  },
  bus: (mess, bus) => {

    logger.info(`${bus.vehicleID}`, { mess: mess, bus: bus, worker: { pid: process.pid } });

  }
};