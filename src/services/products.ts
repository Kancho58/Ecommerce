/* eslint-disable no-useless-catch */
import knex from '../config/knex';
import logger from '../utils/logger';
import { Image, ProductPayload } from '../domains/requests/productPayload';
import BadRequestError from '../exceptions/BadRequestError';
import Table from '../resources/enums/Table';
import * as object from '../utils/object';
import { Knex } from 'knex';

export async function save(
  productPayload: ProductPayload,
  image: Image,
  userId: number
): Promise<ProductPayload> {
  const trx: Knex.Transaction = await knex.transaction();
  try {
    const { title, price, quantity } = productPayload;

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
      .returning('id');

    logger.log('info', 'Inserting image');
    const { filename, path, mimetype, size } = image;
    const productImage = await trx(Table.IMAGES).insert(
      object.toSnakeCase({
        filename,
        path,
        mimetype,
        size,
        productId: newProduct.id,
      })
    );

    // if (!productImage.length) {
    //   throw new BadRequestError('Image should not be empty');
    // }

    await trx.commit();

    logger.log('info', 'Product successfully inserted');

    return object.camelize({ imagePath: path });
  } catch (err) {
    throw err;
  }
}

export async function fetch(
  userId: number,
  page: number,
  perPage: number,
  offset: number
): Promise<any> {
  const products = await knex(Table.PRODUCTS)
    .where(object.toSnakeCase({ userId }))
    .select('*')
    .orderBy('id')
    .limit(perPage)
    .offset(offset);
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
  }));
  return object.camelize({ data, page, perPage });
}

export async function update(
  productId: number,
  productPayload: ProductPayload
): Promise<ProductPayload> {
  try {
    const { title, price, quantity } = productPayload;

    logger.log('info', 'Fetching Product');

    const product = await knex(Table.PRODUCTS).where({ id: productId });

    if (!product.length) {
      logger.log('info', 'Product not found');
      throw new BadRequestError('Product not found');
    }
    const updatedProduct = await knex(Table.PRODUCTS)
      .where({ id: productId })
      .update(object.toSnakeCase({ title, price, quantity }))
      .returning(['id', 'title', 'price', 'quantity']);

    logger.log('info', 'Product updated successfully');

    return object.camelize(updatedProduct[0]);
  } catch (err) {
    throw err;
  }
}
