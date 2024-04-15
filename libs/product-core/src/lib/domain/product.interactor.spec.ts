import { ProductRepositoryPlugin } from './plugin';
import { ProductInteractor } from './product.interactor';
import { Product } from './product.model';

class MockRepo implements ProductRepositoryPlugin {
  getProduct = jest.fn((isin: number) => Promise.resolve({isin} as Product));
  getProducts(isins: string[]): Promise<Product[]> {
    throw new Error('Method not implemented.');
  }
}

describe('ProductInteractor', () => {
  let interactor: ProductInteractor;
  let repo: MockRepo;

  beforeEach(() => {
    repo = new MockRepo();
    interactor = new ProductInteractor(repo);
  });

  it('should get product from repo', async () => {
    const product = await interactor.getProduct(123);

    expect(repo.getProduct).toHaveBeenCalledTimes(1);
    expect(product.isin).toBe(123);
  });

  it('should throw error when there is error in repo', (done) => {
    repo.getProduct = jest.fn((isin: number) => {throw new Error('some error')});

    interactor.getProduct(123).then(() => {
      // never reach this step
      expect(true).toBeFalsy();
    }).catch((error: any) => {
      expect(error.message).toBe('some error');
      done();
    });
  });
});
