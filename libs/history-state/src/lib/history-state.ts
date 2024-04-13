import { ProductHistoryInteractor } from '@product-comparison/product-history';
import { BehaviorSubject, Observable } from 'rxjs';

export class HistoryState {
  private readonly history = new BehaviorSubject<string[]>([]);

  constructor(
    private historyInteractor: ProductHistoryInteractor,
  ) {
    this.initialize();
  }

  getHistory(): Observable<string[]> {
    return this.history.asObservable();
  }

  async setQuery(query: string): Promise<void> {
    const data = await this.historyInteractor.getProductsSearchHistoryUnique(query);

    this.history.next(data);
  }

  async addHistory(query: string): Promise<void> {
    await this.historyInteractor.addProductSearchHistory(query);

    const data = await this.historyInteractor.getProductsSearchHistoryUnique();

    this.history.next(data);
  }

  private async initialize() {
    const data = await this.historyInteractor.getProductsSearchHistoryUnique();

    this.history.next(data);
  }
}
