import { ChangeDetectionStrategy, Component, Inject, InjectionToken, computed } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';

import { CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';

import { ComparisonState } from '@product-comparison/comparison-state';
import { ProductInteractor } from '@product-comparison/product-core';

import { PRODUCT_INTERACTOR } from './di';
import { EMPTY, skip, switchMap } from 'rxjs';

const PRODUCT_STATE = new InjectionToken<ComparisonState>('product-state');

@Component({
  standalone: true,
  imports: [
    DragDropModule,
    MatButtonModule,
    MatInputModule,
    ReactiveFormsModule,
    MatSnackBarModule,
    MatTableModule,
    MatIconModule,
    RouterModule,
  ],
  providers: [
    {
      provide: PRODUCT_STATE, useFactory(productInteractor: ProductInteractor) {
        return new ComparisonState(productInteractor);
      }, deps: [PRODUCT_INTERACTOR],
    },
  ],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  public readonly products = toSignal(this.comparisonState.products$);
  public readonly columns = computed(() => this.products()?.map(p => p.isin.toString()));

  public readonly form = new FormGroup({
    search: new FormControl(''),
  });

  constructor(
    private snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private router: Router,
    @Inject(PRODUCT_STATE) private comparisonState: ComparisonState,
  ) {
    this.comparisonState.products$.pipe(
      skip(1),
      switchMap(products => {
        console.log(products);

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

  async search() {
    const text = this.form.controls.search.value;

    const isin = Number(text);

    if (!text || isNaN(isin)) {
      this.snackBar.open('Error: incorrect input');
      return;
    }

    try {
      const product = await this.comparisonState.addProduct(isin);

      this.snackBar.open(`Product ${product.name} added to comparison`);

      this.form.controls.search.setValue('', {emitEvent: false});
    } catch (error) {
      this.snackBar.open('Error: ' + (error as any).message);
    }
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
