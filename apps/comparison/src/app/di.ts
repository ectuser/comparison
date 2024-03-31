import { InjectionToken, inject } from '@angular/core';
import { ProductRepository } from '@product-comparison/api';
import { ProductInteractor } from '@product-comparison/product-core';
import { ProductRepositoryPlugin } from '@product-comparison/product-core';

export const PRODUCT_REPOSITORY = new InjectionToken<ProductRepositoryPlugin>('product-repository', {
  providedIn: 'root',
  factory() {
    return new ProductRepository()
  }
});

export const PRODUCT_INTERACTOR = new InjectionToken<ProductInteractor>('product-interactor', {
  providedIn: 'root',
  factory() {
    const repository = inject(PRODUCT_REPOSITORY);

    return new ProductInteractor(repository);
  }
});
