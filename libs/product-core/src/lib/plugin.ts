import { Observable } from 'rxjs';
import { Product } from './product.model';

export interface ProductStatePlugin {
  getProducts(): Observable<Product[]>;
  initializeProducts(products: Product[]): Promise<unknown>;
  addProduct(product: Product): Promise<unknown>;
  removeProduct(isin: number): Promise<unknown>;
  reorderProducts(fromIndex: number, toIndex: number): Promise<unknown>;
}

export interface ProductRepositoryPlugin {
  getProduct(isin: number): Promise<Product>;
  getProducts(isins: string[]): Promise<Product[]>;
}
