import { ProductStatePlugin, ProductUseCase, ProductRepositoryPlugin } from '@product-comparison/product-core';
import { ProductState } from '@product-comparison/product-state';

export class Container {
  public readonly productState: ProductStatePlugin;
  public readonly productUseCase: ProductUseCase;

  private static instance?: Container;

  private constructor() {
    this.productState = new ProductState();
    const productRepositoryPlugin = {
      getProduct(isin: number) {
        return fetch('http://localhost:31299/products/' + isin).then(res => res.json())
      }
    } as any as ProductRepositoryPlugin;
    this.productUseCase = new ProductUseCase(
      this.productState,
      productRepositoryPlugin
    );
  }

  public static getInstance(): Container {
    if (this.instance) {
      return this.instance;
    }

    this.instance = new Container();

    return this.instance;
  }
}
