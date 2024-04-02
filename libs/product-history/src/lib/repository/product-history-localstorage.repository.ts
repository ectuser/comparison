import { LocalStorage } from '@product-comparison/localstorage';

import { ProductHistoryRepository } from '../domain/plugin';

export class ProductHistoryLocalstorageRepository implements ProductHistoryRepository {
  private readonly localStorageKey = 'history';

  private readonly ls = new LocalStorage();

  async getHistory(): Promise<string[]> {
    const result = this.ls.getItem<string[]>(this.localStorageKey, {parse: true});

    if (Array.isArray(result) && result.every(item => typeof item === 'string')) {
      return result;
    }

    this.ls.removeItem(this.localStorageKey);

    return [];
  }
  async addHistory(query: string): Promise<void> {
    const history = this.ls.getItem<string[]>(this.localStorageKey, {parse: true}) ?? [];

    this.ls.setItem(this.localStorageKey, [...history, query], {stringify: true});
  }

  async getUniqueHistoryReversed(): Promise<string[]> {
    const history = (await this.getHistory()).reverse();

    return Array.from(new Set(history));
  }

}
