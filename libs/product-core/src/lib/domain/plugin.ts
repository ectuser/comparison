import { Product } from './product.model';

export interface ProductRepositoryPlugin {
  getProduct(isin: number): Promise<Product>;
  getProducts(isins: string[]): Promise<Product[]>;
}
