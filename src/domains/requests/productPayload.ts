/**
 * product interface
 */

export interface ProductPayload {
  title: string;
  price: number;
  quantity: number;
  image: Image;
}

export interface Image {
  filename: string;
  path: string;
  mimetype: string;
  size: number;
}

export interface FetchProduct {
  data: ProductPayload;
  page: number;
  perPage: number;
}
