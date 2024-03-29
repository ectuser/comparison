import { useCase } from './di';

const usecase = useCase;

export async function compareProducts(isins: number[]) {
  const products = await usecase.getProductsByIsins(isins);

  const result = products.map(p => {
    return {
      name: p.name,
      isin: p.isin,
      greaterCap50: p.cap > 50,
    };
  })

  return result;
}
