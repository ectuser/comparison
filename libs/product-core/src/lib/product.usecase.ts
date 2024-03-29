import { TYPES } from '@product-comparison/container';

import { Observable, switchMap, from, map, forkJoin } from 'rxjs';
import { injectable, inject } from 'inversify';

import { ProductRepositoryPlugin, SelectedProductsRepositoryPlugin } from './plugin';
import { Product } from './product.model';

@injectable()
export class ProductUseCase {
  constructor(
    @inject(TYPES.SelectedProductsRepositoryPlugin) private selectedProductsRepository: SelectedProductsRepositoryPlugin,
    @inject(TYPES.ProductRepositoryPlugin) private productRepository: ProductRepositoryPlugin,
  ) {}

  getProducts(): Observable<Product[]> {
    return this.selectedProductsRepository.getProducts().pipe(
      map(productIsins => {
        return productIsins.map(isin => from(this.productRepository.getProduct(isin)))
      }),
      switchMap(reqs => {
        return forkJoin(reqs);
      })
    );
  }

  async getProductsByIsins(isins: number[]): Promise<Product[]> {
    return await Promise.all(isins.map(isin => this.productRepository.getProduct(isin)));
  }

  async addProduct(isin: number): Promise<Product> {
    let product: Product;

    try {
      product = await this.productRepository.getProduct(isin);
    } catch (error) {
      // if error 404 throw not found

      console.log(error);


      throw new Error('Error');
    }

    try {
      await this.selectedProductsRepository.addProduct(isin);
    } catch (error) {
      console.log(error);

      throw new Error((error as any).message);
    }

    return product;
  }

  async removeProduct(isin: number): Promise<void> {
    await this.selectedProductsRepository.removeProduct(isin);
  }

  async reorderProducts(fromIndex: number, toIndex: number): Promise<void> {
    await this.selectedProductsRepository.reorderProducts(fromIndex, toIndex);
  }
}
