import { Product } from '@product-comparison/product-core';

import { Observable } from 'rxjs';

export interface ComparisonState {
  getProducts(): Observable<Product[]>;
  getIsLoading(): Observable<boolean>;

  setProducts(isins: number[]): Promise<void>;
  addProduct(isin: number): Promise<Product>;
  removeProduct(isin: number): Promise<void>;
  reorderProducts(fromIndex: number, toIndex: number): Promise<void>;
}
