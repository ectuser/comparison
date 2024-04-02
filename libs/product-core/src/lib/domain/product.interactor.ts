
import { ProductRepositoryPlugin } from './plugin';

export class ProductInteractor {

  constructor(
    private productRepository: ProductRepositoryPlugin,
  ) {}

  async getProduct(isin: number) {
    return await this.productRepository.getProduct(isin);
  }
}
