import { Product, ProductInteractor } from '@product-comparison/product-core';
import { moveItemInArray } from '@product-comparison/utils';

import { BehaviorSubject, Observable } from 'rxjs';

import { ComparisonState } from './comparison-state';

export class AgnosticComparisonState implements ComparisonState {
  private readonly products = new BehaviorSubject<Product[]>([]);
  private readonly loading = new BehaviorSubject<boolean>(false);

  constructor(
    private productInteractor: ProductInteractor,
  ) {}

  getProducts(): Observable<Product[]> {
    return this.products.asObservable();
  }

  getIsLoading(): Observable<boolean> {
    return this.loading.asObservable();
  }

  async setProducts(isins: number[]): Promise<void> {
    const noDuplicateIsins = Array.from(new Set(isins));

    this.loading.next(true);

    try {
      const requests = noDuplicateIsins.map(isin => {
        const existingProduct = this.products.value.find(p => p.isin === isin);

        if (existingProduct) {
          return Promise.resolve(existingProduct)
        }

        return this.productInteractor.getProduct(isin);
      });

      const newProducts = await Promise.allSettled(requests).then(reqs => {
        return reqs.map(req => {
          if (req.status === 'fulfilled') {
            return req.value;
          }

          return null;
        }).filter(req => !!req)
      }) as Product[];

      this.products.next(newProducts);
    } catch (error: any) {
      const message = 'message' in error ? error?.message : 'error';

      throw new Error(message);
    } finally {
      this.loading.next(false);
    }
  }

  async addProduct(isin: number): Promise<Product> {
    this.loading.next(true);

    try {
      const existingProduct = this.products.value.find(p => p.isin === isin);

      if (existingProduct) {
        throw new Error('Product already exists');
      }

      const product = await this.productInteractor.getProduct(isin);

      this.products.next([...this.products.value, product]);

      return product;
    } catch (error: any) {
      const message = error?.message || 'error';

      throw new Error(message);
    } finally {
      this.loading.next(false);
    }
  }

  async removeProduct(isin: number): Promise<void> {
    this.products.next(this.products.value.filter(p => p.isin !== isin));
  }

  async reorderProducts(fromIndex: number, toIndex: number): Promise<void> {
    const newProductsList = [...this.products.value];
    moveItemInArray(newProductsList, fromIndex, toIndex);

    this.products.next(newProductsList);
  }
}
