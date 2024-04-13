export interface HistorySearchOptions {
  query?: string;
  reversed: boolean;
  unique: boolean;
}

export interface ProductHistoryRepository {
  getHistory(options?: Partial<HistorySearchOptions>): Promise<string[]>;
  addHistory(query: string): Promise<void>;
  getUniqueHistoryReversed(): Promise<string[]>;
}
