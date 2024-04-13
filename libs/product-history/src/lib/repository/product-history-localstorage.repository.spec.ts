import { LocalStorage } from '@product-comparison/localstorage';
import { ProductHistoryLocalstorageRepository } from './product-history-localstorage.repository';

class LsMock extends LocalStorage {
  data = new Map<string, any>();

  override getItem<T>(key: string, options: { parse: boolean; }): string | T | undefined {
    return this.data.get(key);
  }

  override setItem(key: string, value: any, options: { stringify: boolean; }): void {
    this.data.set(key, value);
  }

  override removeItem(key: string): void {
    this.data.delete(key);
  }
}

describe('ProductHistoryLocalstorageRepository', () => {
  let repo: ProductHistoryLocalstorageRepository;

  beforeEach(() => {
    repo = new ProductHistoryLocalstorageRepository(new LsMock());
  });

  describe('getHistory', () => {
    const data = ['123', '321', '321', '321', '124', '124', '123'];

    beforeEach(() => {
      // passing items

      data.forEach(el => {
        repo.addHistory(el);
      });
    });

    it('should return all history when default options passed', async () => {
      const history = await repo.getHistory();
      expect(history).toEqual(data);
    });
  });
});
