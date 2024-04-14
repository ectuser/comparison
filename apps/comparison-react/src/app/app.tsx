import { AgnosticComparisonState } from '@product-comparison/comparison-state';
import { Search } from './search';
import { ProductInteractor, ProductRepository } from '@product-comparison/product-core';
import { Comparison } from './comparison';

export const productRepo = new ProductRepository();
export const productInteractor = new ProductInteractor(productRepo)
export const productState = new AgnosticComparisonState(productInteractor);

export function App() {
  return (
    <div className='p-3'>
      <h1 className='md:text-3xl lg:text-4xl'>Product comparison</h1>
      <div className='pt-5'>
        <Search />
      </div>
      <div className='pt-5'>
        <Comparison />
      </div>
    </div>
  );
}

export default App;
