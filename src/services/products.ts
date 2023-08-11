/* eslint-disable no-useless-catch */
import knex from '../config/knex';
import logger from '../utils/logger';
import {
  FetchProduct,
  Image,
  ProductPayload,
} from '../domains/requests/productPayload';
import BadRequestError from '../exceptions/BadRequestError';
import Table from '../resources/enums/Table';
import * as object from '../utils/object';
import { Knex } from 'knex';

export async function save(
  userId: number,
  productPayload: ProductPayload,
  image: Image
): Promise<ProductPayload> {
  const trx: Knex.Transaction = await knex.transaction();
  try {
    const { title, price, quantity } = productPayload;

    logger.log('info', 'Fetching Product');

    const product = await trx(Table.PRODUCTS).where(
      knex.raw('LOWER(title) =?', title.toLowerCase())
    );

    if (product.length) {
      logger.log('info', 'Title already exists');
      throw new BadRequestError('Title already exists');
    }

    logger.log('info', 'product Inserting');
    const [newProduct] = await trx(Table.PRODUCTS)
      .insert(object.toSnakeCase({ title, price, quantity, userId }))
      .returning(['id', 'title', 'price', 'quantity']);

    logger.log('info', 'Inserting image');
    const { filename, path, mimetype, size } = image;
    await trx(Table.IMAGES).insert(
      object.toSnakeCase({
        filename,
        path,
        mimetype,
        size,
        productId: newProduct.id,
      })
    );

    await trx.commit();

    logger.log('info', 'Product successfully inserted');

    return object.camelize({ product: newProduct, imagePath: path });
  } catch (err) {
    throw err;
  }
}

export async function fetch(
  userId: number,
  page: number,
  perPage: number,
  offset: number
): Promise<FetchProduct> {
  try {
    logger.log('info', 'Fetching Product');
    const products = await knex(Table.PRODUCTS)
      .where(object.toSnakeCase({ userId }))
      .select('products.*', 'images.path as path')
      .orderBy('id')
      .limit(perPage)
      .offset(offset)
      .crossJoin(knex.raw('images'));

    if (!products.length) {
      logger.log('info', 'Product not found');
      throw new BadRequestError('Product not found');
    }

    logger.log('info', 'Product fetched successfully');

    const data = products.map((product) => ({
      id: product.id,
      title: product.title,
      price: product.price,
      quantity: product.quantity,
      image: product.path,
    }));

    return object.camelize({ data, page, perPage });
  } catch (err) {
    throw err;
  }
}

export async function update(
  productId: number,
  productPayload: ProductPayload,
  image: Image
): Promise<ProductPayload> {
  try {
    const productPermittedParams: string[] = ['title', 'price', 'quantity'];
    const { filename, path, mimetype, size } = image;

    logger.log('info', 'Fetching Product');

    let product = await knex(Table.PRODUCTS)
      .where(object.toSnakeCase({ id: productId }))
      .select(['id', ...productPermittedParams]);

    if (!product.length) {
      logger.log('info', 'Product not found');
      throw new BadRequestError('Product not found');
    }

    const productParams = productPermittedParams.reduce(
      (acc: any, paramKey: string) => {
        if (productPayload[paramKey as keyof ProductPayload]) {
          acc[paramKey] = productPayload[paramKey as keyof ProductPayload];
        }
        return acc;
      },
      {}
    );

    logger.log('info', 'Updating Product');

    if (Object.keys(productParams).length) {
      product = await knex(Table.PRODUCTS)
        .where({ id: productId })
        .update(object.toSnakeCase(productParams))
        .returning(['id', ...productPermittedParams]);
    }
    logger.log('info', 'Updating Image');

    if (image) {
      await knex(Table.IMAGES)
        .where(object.toSnakeCase({ productId }))
        .returning('path')
        .update({ filename, path, mimetype, size });
    }
    logger.log('info', 'Product updated successfully');

    return object.camelize({ product: product[0], imagePath: image.path });
  } catch (err) {
    throw err;
  }
}
