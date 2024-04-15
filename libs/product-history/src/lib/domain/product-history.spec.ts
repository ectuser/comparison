import { HistorySearchOptions, ProductHistoryRepository } from './plugin';
import { ProductHistoryInteractor } from './product-history';

class MockRepo implements ProductHistoryRepository {
  private history: string[] = [];

  getHistory(options?: Partial<HistorySearchOptions> | undefined) {
    return Promise.resolve(this.history);
  }
  async addHistory(query: string) {
    this.history.push(query);
  }
  getUniqueHistoryReversed(): Promise<string[]> {
    throw new Error('Method not implemented.');
  }
}

describe('ProductHistoryInteractor', () => {
  let interactor: ProductHistoryInteractor;
  let repo: ProductHistoryRepository;

  beforeEach(() => {
    repo = new MockRepo();
    interactor = new ProductHistoryInteractor(repo);
  });

  it('should add product to repo', async () => {
    await interactor.addProductSearchHistory('test 1');
    await interactor.addProductSearchHistory('test 2');

    const queries = await interactor.getProductsSearchHistoryUnique();

    expect(queries).toEqual(['test 1', 'test 2']);
  });

  it('should throw error when could not add to repo', async () => {
    await interactor.addProductSearchHistory('test 1');

    repo.addHistory = jest.fn((query: string) => {
      throw new Error('error 1');
    });

    interactor.addProductSearchHistory('test 2').then((done) => {
      expect(true).toBeFalsy();
    }).catch((error: any) => {
      expect(error.message).toBe('error 1');

      return {errorMessage: error.message};
    }).then((data: any) => {
      expect(data.errorMessage).toBe('error 1');

      return interactor.getProductsSearchHistoryUnique();
    }).then((queries) => {
      expect(queries).toEqual(['test 1']);
    });
  });
});
