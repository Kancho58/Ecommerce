import * as HttpStatus from 'http-status-codes';
import { Request, Response, NextFunction } from 'express';

import logger from '../utils/logger';
import { POSTGRE_SQL_ERROR_CODES } from '../const/database';
import APIResponseInterface from '../domains/responses/APIResponse';

/**
 * Build error response for validation errors.
 *
 * @param  {Error} err
 * @return {Object}
 */
function buildError(err: any): APIResponseInterface {
  if (err.isJoi) {
    const errorDetails = err.details || [];
    return {
      code: HttpStatus.StatusCodes.BAD_REQUEST,
      message: errorDetails.map((error: any) => error.message),
      data: errorDetails.map((error: any) => ({
        param: error.path.join('.'),
        message: error.message,
      })),
    };
  }

  if (err.isBoom) {
    return {
      code: err.output.statusCode,
      message: err.output.payload.message || err.output.payload.error,
    };
  }

  if (err.isCustom) {
    return {
      code: err.statusCode,
      message: err.message,
    };
  }

  if (err.code === POSTGRE_SQL_ERROR_CODES.UNIQUE_CONSTRAINT_VIOLATONS.code) {
    return {
      code: HttpStatus.BAD_REQUEST,
      message: POSTGRE_SQL_ERROR_CODES.UNIQUE_CONSTRAINT_VIOLATONS.message,
    };
  }

  return {
    code: HttpStatus.INTERNAL_SERVER_ERROR,
    message: HttpStatus.getStatusText(HttpStatus.INTERNAL_SERVER_ERROR),
  };
}

/**
 * Generic error response middleware for internal server errors.
 *
 * @param  {any} err
 * @param  {Request} req
 * @param  {Response} res
 * @param  {NextFunction} next
 * @returns void
 */
export default function genericErrorHandler(
  err: any,
  _: Request,
  res: Response,
  // TODO: Remove this.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  __: NextFunction
): void {
  const error = buildError(err);

  logger.error(
    'Error: ',
    { name: error.code, message: err.stack || err.message },
    2
  );
  res.status(error.code).json(error);
}
