import { InjectionToken, inject } from '@angular/core';

import { LocalStorage } from '@product-comparison/localstorage';
import { ProductInteractor, ProductRepository } from '@product-comparison/product-core';
import { ProductRepositoryPlugin } from '@product-comparison/product-core';
import { ProductHistoryInteractor, ProductHistoryRepository, ProductHistoryLocalstorageRepository } from '@product-comparison/product-history';

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

export const HISTORY_REPOSITORY = new InjectionToken<ProductHistoryRepository>('history-repository', {
  providedIn: 'root',
  factory() {
    return new ProductHistoryLocalstorageRepository(new LocalStorage());
  }
})

export const HISTORY_INTERACTOR = new InjectionToken<ProductHistoryInteractor>('history-interactor', {
  providedIn: 'root',
  factory() {
    const repo = inject(HISTORY_REPOSITORY);

    return new ProductHistoryInteractor(repo);
  }
});
