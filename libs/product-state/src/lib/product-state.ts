import { SelectedProductsRepositoryPlugin } from '@product-comparison/product-core';
import { injectable } from 'inversify';

import { BehaviorSubject, Observable } from 'rxjs';

@injectable()
export class ProductState implements SelectedProductsRepositoryPlugin {
  private readonly productIsins$ = new BehaviorSubject<number[]>([]);

  getProducts(): Observable<number[]> {
    return this.productIsins$.asObservable();
  }

  async initializeProducts(isins: number[]): Promise<void> {
    this.productIsins$.next(isins);
  }

  async addProduct(isin: number): Promise<void> {
    const existingProduct = this.productIsins$.value.find(productIsin => productIsin === isin);

    if (existingProduct) {
      throw new Error('Product exists');
    }

    const arr = [...this.productIsins$.value, isin];
    this.productIsins$.next(arr);
  }

  async removeProduct(isin: number): Promise<void> {
    const arr = this.productIsins$.value.filter(productIsin => productIsin !== isin);
    this.productIsins$.next(arr);
  }

  async reorderProducts(fromIndex: number, toIndex: number): Promise<void> {
    const newArr = [...this.productIsins$.value];
    moveItemInArray(newArr, fromIndex, toIndex);
    this.productIsins$.next(newArr);
  }

}

function moveItemInArray<T = any>(array: T[], fromIndex: number, toIndex: number): void {
  const from = clamp(fromIndex, array.length - 1);
  const to = clamp(toIndex, array.length - 1);

  if (from === to) {
    return;
  }

  const target = array[from];
  const delta = to < from ? -1 : 1;

  for (let i = from; i !== to; i += delta) {
    array[i] = array[i + delta];
  }

  array[to] = target;
}

function clamp(value: number, max: number): number {
  return Math.max(0, Math.min(max, value));
}
