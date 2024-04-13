
import { ComparisonState } from '@product-comparison/comparison-state';
import { Product, ProductInteractor } from '@product-comparison/product-core';
import { moveItemInArray } from '@product-comparison/utils';

import { Store, createAction, createFeatureSelector, createReducer, createSelector, on, props } from '@ngrx/store';
import { Actions, createEffect, ofType } from '@ngrx/effects';

import { Observable, filter, from, lastValueFrom, map, of, skip, switchMap, take, withLatestFrom } from 'rxjs';
import { Inject, Injectable } from '@angular/core';
import { PRODUCT_INTERACTOR } from './di';

type ComparisonStore = {
  loading: boolean;
  products: Product[];
  error: string | null;
};

const initializeProducts = createAction('[Comparison] Set Products', props<{isins: number[]}>());
const initializedProductsLoaded = createAction('[Comparison] Initialized Loaded products', props<{products: Product[]}>());
const reorderProducts = createAction('[Comparison] Reorder Products', props<{fromIndex: number, toIndex: number}>());
const removeProduct = createAction('[Comparison] Remove Product', props<{isin: number}>());
const addProduct = createAction('[Comparison] Add Product', props<{isin: number}>());
const addProductLoaded = createAction('[Comparison] Add Product Loaded', props<{product: Product}>());
const addProductFailure = createAction('[Comparison] Add Product Failure');

const initialStore: ComparisonStore = {
  loading: false,
  products: [],
  error: null,
};

export const comparisonReducer = createReducer(
  initialStore,
  on(initializeProducts, state => ({ ...state, loading: true })),
  on(initializedProductsLoaded, (state, {products}) => ({ ...state, loading: false, products })),
  on(reorderProducts, (state, {fromIndex, toIndex}) => {
    const tempProducts = [...state.products];
    moveItemInArray(tempProducts, fromIndex, toIndex)

    return {
      ...state,
      products: tempProducts,
    };
  }),
  on(removeProduct, (state, {isin}) => ({...state, products: state.products.filter(p => p.isin !== isin)})),
  on(addProduct, (state) => ({...state, loading: true})),
  on(addProductLoaded, (state, {product}) => ({...state, products: [...state.products, product]})),
  on(addProductFailure, (state) => ({...state, error: 'Add product failure', loading: false})),
);

const selectComparison = createFeatureSelector<ComparisonStore>('comparison');

const selectProducts = createSelector(
  selectComparison,
  state => state.products
);

const selectLoading = createSelector(
  selectComparison,
  state => state.loading
);

export class SignalComparisonState implements ComparisonState {
  constructor(
    private store: Store,
  ) {}

  getProducts(): Observable<Product[]> {
    return this.store.select(selectProducts);
  }
  getIsLoading(): Observable<boolean> {
    return this.store.select(selectLoading);
  }

  async setProducts(isins: number[]): Promise<void> {
    this.store.dispatch(initializeProducts({isins}));
  }

  async addProduct(isin: number): Promise<Product> {
    const product$ = this.getProducts().pipe(
      skip(1),
      take(1),
      map(products => products[products.length - 1]),
      filter(product => !!product),
    ) as Observable<Product>;

    this.store.dispatch(addProduct({isin}));

    return lastValueFrom(product$);
  }

  async removeProduct(isin: number): Promise<void> {
    this.store.dispatch(removeProduct({isin}));
  }

  async reorderProducts(fromIndex: number, toIndex: number): Promise<void> {
    this.store.dispatch(reorderProducts({fromIndex, toIndex}));
  }
}

@Injectable()
export class ComparisonEffects {

  readonly loadProducts$ = createEffect(() => this.actions$.pipe(
    ofType(initializeProducts),
    withLatestFrom(this.store.select(selectProducts)),
    switchMap(([{isins}, existingProducts]) => {
      const nonDuplicates = Array.from(new Set(isins));

      const requests = nonDuplicates.map(isin => {
        const existingProduct = existingProducts.find(p => p.isin === isin);

        if (existingProduct) {
          return Promise.resolve(existingProduct)
        }

        return this.productInteractor.getProduct(isin);
      });

      return from(Promise.allSettled(requests)).pipe(
        map((responses) => {
          return responses.map(res => {
            if (res.status === 'fulfilled') {
              return res.value;
            }

            return null;
          }).filter(val => val !== null) as Product[];
        }),
        map(products => initializedProductsLoaded({products}))
      );
    }),
  ));

  readonly addProduct$ = createEffect(() => this.actions$.pipe(
    ofType(addProduct),
    withLatestFrom(this.store.select(selectProducts)),
    switchMap(([{isin}, products]) => {
      if (products.some(product => product.isin === isin)) {
        return of(addProductFailure());
      } else {
        return from(this.productInteractor.getProduct(isin)).pipe(
          map(product => {
            return addProductLoaded({product});
          }),
        )
      }
    }),
  ));

  constructor(
    private actions$: Actions,
    private store: Store,
    @Inject(PRODUCT_INTERACTOR) private productInteractor: ProductInteractor,
  ) {}
}
