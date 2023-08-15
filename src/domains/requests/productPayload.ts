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

interface FetchProductData {
  id: number;
  title: string;
  price: number;
  quantity: number;
  image: string;
}

export interface FetchProduct {
  data: FetchProductData[];
  page: number;
  perPage: number;
}
