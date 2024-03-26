import { ChangeDetectionStrategy, Component, computed, effect } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { toSignal } from '@angular/core/rxjs-interop';

import { CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';

import { Container } from '@product-comparison/container';

@Component({
  standalone: true,
  imports: [DragDropModule, MatButtonModule, MatInputModule, ReactiveFormsModule, MatSnackBarModule, MatTableModule, MatIconModule],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {

  private readonly container = Container.getInstance();

  private readonly useCase = this.container.productUseCase;

  public readonly products = toSignal(this.useCase.getProducts());
  public readonly columns = computed(() => this.products()?.map(p => p.isin.toString()));

  public readonly form = new FormGroup({
    search: new FormControl(''),
  });

  constructor(private snackBar: MatSnackBar) {}

  async search() {
    const text = this.form.controls.search.value;

    const isin = Number(text);

    if (!text || isNaN(isin)) {
      this.snackBar.open('Error: incorrect input');
      return;
    }

    try {
      const product = await this.useCase.addProduct(isin);

      this.snackBar.open(`Product ${product.name} added to comparison`);

      this.form.controls.search.setValue('', {emitEvent: false});
    } catch (error) {
      this.snackBar.open('Error: ' + (error as any).message);
    }
  }

  async removeProduct(isin: number) {
    try {
      await this.useCase.removeProduct(isin);

      this.snackBar.open('Product successfully removed');
    } catch (error) {
      console.log(error);

      this.snackBar.open('Error');
    }

  }

  drop(event: CdkDragDrop<any, any, any>) {
    this.useCase.reorderProducts(event.previousIndex, event.currentIndex);
  }
}
