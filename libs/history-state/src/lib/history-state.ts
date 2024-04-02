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
