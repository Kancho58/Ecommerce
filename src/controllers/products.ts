import { Request, Response, NextFunction } from 'express';
import * as HttpStatus from 'http-status-codes';
import * as productServices from '../services/products';
import { Image, ProductPayload } from '../domains/requests/productPayload';

export async function save(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const productPayload = req.body as ProductPayload;
    const image = req.file as Image;

    const product = await productServices.save(
      productPayload,
      image,
      res.locals.loggedInPayload.userId
    );

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
): Promise<any> {
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

    const updatedProduct = await productServices.update(id, productPayload);
    res.status(HttpStatus.StatusCodes.OK).json({
      success: true,
      data: updatedProduct,
    });
  } catch (err) {
    next(err);
  }
}
