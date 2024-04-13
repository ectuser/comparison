import { ProductHistoryRepository } from './plugin';

export class ProductHistoryInteractor {
  constructor(
    private productSearchRepository: ProductHistoryRepository
  ) {}

  async getProductsSearchHistoryUnique(query?: string): Promise<string[]> {
    return this.productSearchRepository.getHistory({reversed: true, unique: true, query});
  }

  async addProductSearchHistory(query: string): Promise<void> {
    await this.productSearchRepository.addHistory(query);
  }
}
