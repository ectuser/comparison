import { ProductHistoryRepository } from './plugin';

export class ProductHistoryInteractor {
  constructor(
    private productSearchRepository: ProductHistoryRepository
  ) {}

  async getProductsSearchHistoryUnique(): Promise<string[]> {
    return this.productSearchRepository.getUniqueHistoryReversed();
  }

  async getProductsSearchHistory(): Promise<string[]> {
    return this.productSearchRepository.getHistory();
  }

  async addProductSearchHistory(query: string): Promise<void> {
    await this.productSearchRepository.addHistory(query);
  }
}
