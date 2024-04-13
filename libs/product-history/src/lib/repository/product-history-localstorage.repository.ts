import { LocalStorage } from '@product-comparison/localstorage';

import { HistorySearchOptions, ProductHistoryRepository } from '../domain/plugin';

const defaultSearchOptions: HistorySearchOptions = {
  reversed: false,
  unique: false,
};

export class ProductHistoryLocalstorageRepository implements ProductHistoryRepository {
  private readonly localStorageKey = 'history';

  constructor(
    private ls: LocalStorage,
  ) {}

  async getHistory(_options?: Partial<HistorySearchOptions>): Promise<string[]> {
    const options = {...defaultSearchOptions, ..._options};
    let result = this.ls.getItem<string[]>(this.localStorageKey, {parse: true});

    if (!Array.isArray(result) || !result.every(item => typeof item === 'string')) {
      this.ls.removeItem(this.localStorageKey);

      return [];
    }

    if (options.query) {
      result = result.filter(r => r.includes(options.query as string));
    }

    if (options.reversed) {
      // mutates arr
      result = result.reverse();
    }

    if (options.unique) {
      result = Array.from(new Set(result));
    }

    return result;
  }
  async addHistory(query: string): Promise<void> {
    const history = this.ls.getItem<string[]>(this.localStorageKey, {parse: true}) ?? [];

    this.ls.setItem(this.localStorageKey, [...history, query], {stringify: true});
  }

  async getUniqueHistoryReversed(): Promise<string[]> {
    const history = (await this.getHistory({unique: true, reversed: true}));

    return Array.from(new Set(history));
  }

}
