import { ProductStatePlugin, Product } from '@product-comparison/product-core';

import { BehaviorSubject, Observable } from 'rxjs';

// refactor to store isins only

export class ProductState implements ProductStatePlugin {
  private readonly products$ = new BehaviorSubject<Product[]>([]);

  getProducts(): Observable<Product[]> {
    return this.products$.asObservable();
  }

  async initializeProducts(products: Product[]): Promise<void> {
    this.products$.next(products);
  }

  async addProduct(product: Product): Promise<void> {
    const existingProduct = this.products$.value.find(p => p.isin === product.isin);

    if (existingProduct) {
      throw new Error('Product exists');
    }

    const arr = [...this.products$.value, product];
    this.products$.next(arr);
  }

  async removeProduct(isin: number): Promise<void> {
    const arr = this.products$.value.filter(product => product.isin !== isin);
    this.products$.next(arr);
  }

  async reorderProducts(fromIndex: number, toIndex: number): Promise<void> {
    const newArr = [...this.products$.value];
    moveItemInArray(newArr, fromIndex, toIndex);
    this.products$.next(newArr);
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
