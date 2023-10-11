import log4js from 'log4js';

log4js.configure({
  appenders: {
    system: {
      type: 'dateFile',
      filename: 'logs/system',
      pattern: '-yyyy-MM-dd.log',
      alwaysIncludePattern: true
    },
    error: {
      type: 'dateFile',
      filename: 'logs/error',
      pattern: '-yyyy-MM-dd.log',
      alwaysIncludePattern: true
    },
    justErrors: {
      type: 'logLevelFilter',
      appender: 'error',
      level: 'error'
    }
  },
  categories: {
    default: { appenders: ['system', 'justErrors'], level: 'debug' }
  }
});

const logger = log4js.getLogger('default');

export default logger;