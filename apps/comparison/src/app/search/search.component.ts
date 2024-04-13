
import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';

import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { HistoryState } from '@product-comparison/history-state';
import { ComparisonState } from '@product-comparison/comparison-state';

import { filter, switchMap } from 'rxjs';

import { HISTORY_STATE, PRODUCT_STATE } from '../app.component';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [
    MatButtonModule,
    MatInputModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    AsyncPipe,
    MatProgressSpinnerModule,
  ],
  template: `
    <form [formGroup]="form" (ngSubmit)="search()">
      <mat-form-field>
        <mat-label>Search</mat-label>
        <input matInput formControlName="search" [matAutocomplete]="auto">

        @if (loading$ | async) {
          <span matTextSuffix>
            <mat-spinner [diameter]="20"></mat-spinner>
          </span>
        }

        <mat-autocomplete #auto="matAutocomplete" (optionSelected)="selectHistoryOption($event)">
          @for (option of history$ | async; track $index) {
            <mat-option [value]="option">{{option}}</mat-option>
          }
        </mat-autocomplete>
      </mat-form-field>

      <div>
        <button mat-flat-button color="primary" type="submit">Search</button>
      </div>
    </form>
  `,
  styles: `
    :host {
      display: block;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchComponent {
  readonly form = new FormGroup({
    search: new FormControl(''),
  });

  readonly history$ = this.historyState.getHistory();
  readonly loading$ = this.comparisonState.getIsLoading();

  constructor(
    @Inject(HISTORY_STATE) private historyState: HistoryState,
    @Inject(PRODUCT_STATE) private comparisonState: ComparisonState,
    private snackBar: MatSnackBar,
  ) {
    this.loading$.pipe(takeUntilDestroyed()).subscribe(loading => {
      if (loading) {
        this.form.controls.search.disable();
      } else {
        this.form.controls.search.enable();
      }
    });

    this.form.controls.search.valueChanges.pipe(
      filter((val) => val !== null),
      switchMap((value) => {
        return this.historyState.setQuery(value as string);
      }),
      takeUntilDestroyed()
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

      this.form.controls.search.setValue('');

      await this.historyState.addHistory(text);
    } catch (error) {
      this.snackBar.open('Error: ' + (error as any).message);
    }
  }

  async selectHistoryOption(ev: MatAutocompleteSelectedEvent) {
    ev.option.deselect();

    const value = ev.option.value;

    this.form.controls.search.setValue(value);

    await this.search();

  }
}
