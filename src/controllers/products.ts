import { Request, Response, NextFunction } from 'express';
import * as HttpStatus from 'http-status-codes';
import * as productServices from '../services/products';
import { Image, ProductPayload } from '../domains/requests/productPayload';
import logger from '../utils/logger';
import BadRequestError from '../exceptions/BadRequestError';

export async function save(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const productPayload = Object.assign({}, req.body as ProductPayload);
    const image = req.file as Image;

    if (!req.file) {
      throw new BadRequestError('Image should not be empty');
    }

    const product = await productServices.save(
      res.locals.loggedInPayload.userId,
      productPayload,
      image
    );

    logger.log('info', 'Product created successfully');
    res.status(HttpStatus.StatusCodes.CREATED).json({
      success: true,
      data: product,
    });
  } catch (err) {
    next(err);
  }
}

export async function fetch(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const page = Number(req.query.page) || 1;
    const perPage = Number(req.query.perPage || 5);
    const offset = perPage * (page - 1);

    const data = await productServices.fetch(
      res.locals.loggedInPayload.userId,
      page,
      perPage,
      offset
    );

    logger.log('info', 'Product fetched');
    res.status(HttpStatus.StatusCodes.OK).json({
      success: true,
      data,
    });
  } catch (err) {
    next(err);
  }
}

export async function update(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const productPayload = req.body as ProductPayload;
    const id: number = parseInt(req.params.id);
    const image = (req.file as Image) || '';

    const updatedProduct = await productServices.update(
      id,
      productPayload,
      image
    );

    logger.log('info', 'Product updated successfully');
    res.status(HttpStatus.StatusCodes.OK).json({
      success: true,
      data: updatedProduct,
    });
  } catch (err) {
    next(err);
  }
}
