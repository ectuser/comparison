export type InvestmentType = 'etf' | 'fund';

interface BaseProduct {
  cap: number;
  isin: number;
  baseCurrency: string;
  name: string;
  investmentType: InvestmentType;
}

export interface EtfProduct extends BaseProduct {
  investmentType: 'etf';
  wkn: string;
}

export interface FundProduct extends BaseProduct {
  investmentType: 'fund';
  rating: number;
}

export type Product = EtfProduct | FundProduct;
