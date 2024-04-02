import { Product, ProductRepositoryPlugin } from '@product-comparison/product-core';

export class ProductRepository implements ProductRepositoryPlugin {
  getProduct(isin: number): Promise<Product> {
    return fetch('http://localhost:31299/products/' + isin).then(res => res.json()).then(res => wait(1000, res));
  }
  getProducts(isins: string[]): Promise<Product[]> {
    throw new Error('Method not implemented.');
  }
}

function wait<T>(ms: number, value: T): Promise<T> {
  return new Promise(resolve => setTimeout(resolve, ms, value));
}
