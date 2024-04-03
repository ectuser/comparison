import { ProductInteractor, ProductRepository } from '@product-comparison/product-core';

const repo = new ProductRepository();
const usecase = new ProductInteractor(repo);

export async function compareProducts(isins: number[]) {
  console.log(isins);

  const reqs = await Promise.allSettled(isins.map(isin => usecase.getProduct(isin)));
  const products = reqs.map(res => {
    if (res.status === 'fulfilled') {
      return res.value;
    }

    return null;
  }).filter(res => res !== null);

  const result = products.map(p => {
    return {
      name: p.name,
      isin: p.isin,
      greaterCap50: p.cap > 50,
    };
  })

  return result;
}
