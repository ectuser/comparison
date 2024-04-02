export interface ProductHistoryRepository {
  getHistory(): Promise<string[]>;
  addHistory(query: string): Promise<void>;
  getUniqueHistoryReversed(): Promise<string[]>;
}
