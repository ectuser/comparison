import { ApiEtf, ApiFund, getProduct } from '@product-comparison/api';

import { ProductRepositoryPlugin } from '../domain/plugin';
import { EtfProduct, FundProduct, Product } from '../domain/product.model';

export class ProductRepository implements ProductRepositoryPlugin {
  async getProduct(isin: number): Promise<Product> {
    const apiProduct = await getProduct(isin);

    const product = apiProduct.invType === 0 ? mapApiEtfToDomain(apiProduct) : mapApiFundToDomain(apiProduct);

    return product;
  }
  getProducts(isins: string[]): Promise<Product[]> {
    throw new Error('Method not implemented.');
  }
}

function mapApiEtfToDomain(apiEtf: ApiEtf): EtfProduct {
  const obj: EtfProduct = {
    baseCurrency: apiEtf.baseCurrency,
    cap: apiEtf.cap,
    investmentType: 'etf',
    isin: apiEtf.isin,
    name: apiEtf.name,
    wkn: apiEtf.wkn,
  };

  return obj;
}

function mapApiFundToDomain(apiFund: ApiFund): FundProduct {
  const obj: FundProduct = {
    baseCurrency: apiFund.baseCurrency,
    cap: apiFund.cap,
    investmentType: 'fund',
    isin: apiFund.isin,
    name: apiFund.fundname,
    rating: apiFund.rating,
  };

  return obj;
}
