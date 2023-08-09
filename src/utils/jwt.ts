import jwbt from 'jsonwebtoken';

import logger from './logger';
import config from '../config/config';
import JWTPayload from '../domains/misc/JWTPayload';

const { accessTokenDuration, accessTokenSecretKey } = config.auth;

/**
 * Generate access token from given data
 *
 * @returns {string}
 */
export function generateAccessToken(data: JWTPayload): string {
  logger.log('info', 'JWT: Generating access token -', {
    data,
    expiresIn: accessTokenDuration,
  });

  return jwbt.sign({ data }, accessTokenSecretKey, {
    expiresIn: accessTokenDuration,
  });
}

/**
 * Verify access token.
 *
 * @param {string} token
 * @returns {object | string}
 */
export function verifyAccessToken(token: string): object | string {
  return jwbt.verify(token, accessTokenSecretKey);
}
