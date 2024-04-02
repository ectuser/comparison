export interface ApiEtf {
  cap: number;
  isin: number;
  baseCurrency: string;
  name: string;
  invType: 0;
  wkn: string,
}

export interface ApiFund {
  cap: number;
  isin: number;
  baseCurrency: string;
  fundname: string;
  invType: 1;
  rating: number;
}

export type ApiProduct = ApiEtf | ApiFund;

export function getProduct(isin: number): Promise<ApiProduct> {
  return fetch('http://localhost:31299/products/' + isin).then(res => res.json()).then(res => wait(1000, res));
}

function wait<T>(ms: number, value: T): Promise<T> {
  return new Promise(resolve => setTimeout(resolve, ms, value));
}
