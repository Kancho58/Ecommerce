import * as winston from 'winston';
import * as stream from 'stream';

import config from '../config/config';

const { level } = config.logging;

const upCaseLevel = winston.format((info) => {
  info.level = info.level.toUpperCase();
  return info;
});

// In CloudWatch, extra parameters must be inside
// 'fields' key to be included as JSON object in log events.
// It helps to query in CloudWatch.
const wrapExtraParametersInFields = winston.format((info) => {
  const { level, message, ...rest } = info;
  info.level = level; // just to bypass eslint unused variable warning.
  info.message = message; // just to bypass eslint unused variable warning.
  return {
    ...info,
    fields: rest,
  };
});

const transports = [];

// Add transports.
transports.push(
  new winston.transports.Console({
    level,
    format:
      process.env.NODE_ENV === 'development'
        ? winston.format.combine(
            upCaseLevel(),
            winston.format.colorize(),
            winston.format.timestamp(),
            winston.format.splat(),
            winston.format.simple()
          )
        : winston.format.combine(
            wrapExtraParametersInFields(),
            winston.format.splat(),
            winston.format.timestamp(),
            winston.format.json()
          ),
  })
);

// Create a logger using the configuration.
const logger = winston.createLogger({ transports });

/**
 * A writable stream for winston logging.
 */
export const logStream = new stream.Writable({
  write(message: any): any {
    logger.info(message.toString());
  },
});

export default logger;
