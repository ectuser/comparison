export class LocalStorage {
  private readonly prefix = 'product-comparison_';

  getItem<T>(key: string, options: {parse: true}): undefined | T;
  getItem(key: string, options: {parse: false}): undefined | string;
  getItem<T>(key: string, options: {parse: boolean}): undefined | T | string {
    const item = localStorage.getItem(this.assembleKey(key));

    if (!item) {
      return undefined;
    }

    if (options.parse) {
      return JSON.parse(item);
    }

    return item;
  }

  setItem(key: string, value: string, options: {stringify: false}): void;
  setItem(key: string, value: any, options: {stringify: true}): void;
  setItem(key: string, value: any, options: {stringify: boolean}): void {
    const assembledKey = this.assembleKey(key);

    const transformedValue: string = options.stringify ? JSON.stringify(value) : value;

    localStorage.setItem(assembledKey, transformedValue);
  }

  removeItem(key: string): void {
    localStorage.removeItem(this.assembleKey(key));
  }

  private assembleKey(key: string): string {
    return this.prefix + key;
  }
}
