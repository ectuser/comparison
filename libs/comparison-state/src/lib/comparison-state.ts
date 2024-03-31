import { Product, ProductInteractor } from '@product-comparison/product-core';
import { BehaviorSubject, Observable } from 'rxjs';

export class ComparisonState {
  readonly products$: Observable<Product[]>;

  private readonly products = new BehaviorSubject<Product[]>([]);

  constructor(
    private productInteractor: ProductInteractor,
  ) {
    this.products$ = this.products.asObservable();
  }

  async setProducts(isins: number[]) {
    const requests = isins.map(isin => {
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
  }

  async addProduct(isin: number) {
    const existingProduct = this.products.value.find(p => p.isin === isin);

    if (existingProduct) {
      throw new Error('Product already exists');
    }

    const product = await this.productInteractor.getProduct(isin);

    this.products.next([...this.products.value, product]);

    return product;
  }

  async removeProduct(isin: number) {
    this.products.next(this.products.value.filter(p => p.isin !== isin));
  }

  async reorderProducts(fromIndex: number, toIndex: number) {
    const newProductsList = [...this.products.value];
    moveItemInArray(newProductsList, fromIndex, toIndex);

    this.products.next(newProductsList);
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

/** Clamps a number between zero and a maximum. */
function clamp(value: number, max: number): number {
  return Math.max(0, Math.min(max, value));
}
