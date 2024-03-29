import { Observable } from 'rxjs';
import { Product } from './product.model';

export interface SelectedProductsRepositoryPlugin {
  getProducts(): Observable<number[]>;
  initializeProducts(isins: number[]): Promise<unknown>;
  addProduct(isin: number): Promise<unknown>;
  removeProduct(isin: number): Promise<unknown>;
  reorderProducts(fromIndex: number, toIndex: number): Promise<unknown>;
}

export interface ProductRepositoryPlugin {
  getProduct(isin: number): Promise<Product>;
  getProducts(isins: string[]): Promise<Product[]>;
}
