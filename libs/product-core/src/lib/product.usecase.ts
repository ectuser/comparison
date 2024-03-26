import { Observable } from 'rxjs';

import { ProductRepositoryPlugin, ProductStatePlugin } from './plugin';
import { Product } from './product.model';

export class ProductUseCase {
  constructor(
    private productState: ProductStatePlugin,
    private productRepository: ProductRepositoryPlugin,
  ) {}

  getProducts(): Observable<Product[]> {
    return this.productState.getProducts();
  }

  async initializeProducts(isins: string[]): Promise<Product[]> {
    let products: Product[];

    try {
      products = await this.productRepository.getProducts(isins);
    } catch (error) {
      // if error 404 throw not found

      throw new Error('Error');
    }

    await this.productState.initializeProducts(products);

    return products;
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
      await this.productState.addProduct(product);
    } catch (error) {
      console.log(error);

      throw new Error((error as any).message);
    }

    return product;
  }

  async removeProduct(isin: number): Promise<void> {
    await this.productState.removeProduct(isin);
  }

  async reorderProducts(fromIndex: number, toIndex: number): Promise<void> {
    await this.productState.reorderProducts(fromIndex, toIndex);
  }
}
