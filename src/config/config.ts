import * as dotenv from 'dotenv';
import * as errors from '../resources/lang/error.json';
import * as messages from '../resources/lang/messages.json';

dotenv.config();
const isLocalEnvironment = process.env.APP_PORT != undefined;

export default {
  errors,
  messages,
  name: 'todo-api',
  version: '2.0.0',
  host: process.env.APP_HOST || '127.0.0.1',
  environment: process.env.NODE_ENV || 'development',
  appUrl: process.env.APP_URL || 'http://localhost:8000',
  port:
    (isLocalEnvironment ? process.env.APP_PORT : process.env.PORT) || '8000',
  pagination: {
    page: 1,
    maxRows: 20,
  },
  logging: {
    dir: process.env.LOGGING_DIR || 'logs',
    level: process.env.LOGGING_LEVEL || 'debug',
    maxSize: process.env.LOGGING_MAX_SIZE || '20m',
    maxFiles: process.env.LOGGING_MAX_FILES || '7d',
    datePattern: process.env.LOGGING_DATE_PATTERN || 'YYYY-MM-DD',
  },
  auth: {
    saltRounds: process.env.SALT_ROUNDS || 11,
    accessTokenDuration: process.env.ACCESS_TOKEN_DURATION || '10m',
    accessTokenSecretKey:
      process.env.ACCESS_TOKEN_SECRET_KEY || '<ACCESS_TOKEN_SECRET_KEY>',
  },
  db: {
    client: process.env.DB_CLIENT,
    connection: {
      charset: 'utf8',
      timezone: 'UTC',
      host: process.env.DB_HOST,
      port: +(process.env.DB_PORT || '5432'),
      database:
        process.env.NODE_ENV === 'test'
          ? process.env.TEST_DB_NAME
          : process.env.DB_NAME,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
    },
  },
};
