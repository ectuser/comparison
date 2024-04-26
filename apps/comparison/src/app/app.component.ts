import { ChangeDetectionStrategy, Component, Inject, InjectionToken, Signal, computed } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';

import { CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { AgnosticComparisonState, ComparisonState } from '@product-comparison/comparison-state';
import { Product, ProductInteractor } from '@product-comparison/product-core';
import { HistoryState } from '@product-comparison/history-state';
import { ProductHistoryInteractor } from '@product-comparison/product-history';

import { Store } from '@ngrx/store';
import { skip, switchMap } from 'rxjs';

import { HISTORY_INTERACTOR, PRODUCT_INTERACTOR } from './di';
import { SearchComponent } from './search/search.component';
import { NgrxComparisonState } from './comparison.store';

export const PRODUCT_STATE = new InjectionToken<ComparisonState>('product-state');
export const HISTORY_STATE = new InjectionToken<HistoryState>('history-state');

@Component({
  standalone: true,
  imports: [
    DragDropModule,
    MatSnackBarModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    RouterModule,
    SearchComponent,
    MatProgressSpinnerModule,
  ],
  providers: [
    {
      provide: PRODUCT_STATE, useFactory(store: Store, productInteractor: ProductInteractor) {
        return new AgnosticComparisonState(productInteractor);
        return new NgrxComparisonState(store);
      }, deps: [Store, PRODUCT_INTERACTOR],
    },
    {
      provide: HISTORY_STATE, useFactory(historyInteractor: ProductHistoryInteractor) {
        return new HistoryState(historyInteractor);
      }, deps: [HISTORY_INTERACTOR]
    },
  ],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  readonly products: Signal<Product[]>;
  readonly columns: Signal<string[]>;
  readonly loading: Signal<boolean>;

  constructor(
    private snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private router: Router,
    @Inject(PRODUCT_STATE) private comparisonState: ComparisonState,
    @Inject(HISTORY_STATE) public historyState: HistoryState,
  ) {
    const products$ = this.comparisonState.getProducts();

    this.products = toSignal(products$, {initialValue: []});
    this.columns = computed(() => this.products()?.map(p => p.isin.toString()));
    this.loading = toSignal(this.comparisonState.getIsLoading(), {initialValue: false});

    products$.pipe(
      skip(1),
      switchMap(products => {
        return this.router.navigate(['.'], {
          queryParams: {
            isins: products.map(p => p.isin),
          },
          replaceUrl: false,
        })
      }),
      takeUntilDestroyed(),
    ).subscribe();

    this.route.queryParams.pipe(
      skip(1),
      switchMap(qp => {
        let isinsQp: string | string[] = qp['isins'];

        if (!Array.isArray(isinsQp)) {
          isinsQp = [isinsQp];
        }

        const isins = isinsQp
          .map(isin => Number(isin))
          .filter(isin => !isNaN(isin));

        return this.comparisonState.setProducts(isins);
      }),
      takeUntilDestroyed(),
    ).subscribe();
  }

  async removeProduct(isin: number) {
    try {
      await this.comparisonState.removeProduct(isin);

      this.snackBar.open('Product successfully removed');
    } catch (error) {
      console.log(error);

      this.snackBar.open('Error');
    }

  }

  drop(event: CdkDragDrop<any, any, any>) {
    this.comparisonState.reorderProducts(event.previousIndex, event.currentIndex);
  }
}
