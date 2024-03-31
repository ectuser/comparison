import { Product, ProductRepositoryPlugin } from '@product-comparison/product-core';

export class ProductRepository implements ProductRepositoryPlugin {
  getProduct(isin: number): Promise<Product> {
    return fetch('http://localhost:31299/products/' + isin).then(res => res.json());
  }
  getProducts(isins: string[]): Promise<Product[]> {
    throw new Error('Method not implemented.');
  }
}
