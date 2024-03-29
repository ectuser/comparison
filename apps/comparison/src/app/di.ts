import { Injectable } from '@angular/core';
import { ProductUseCase } from '@product-comparison/product-core';

import { myContainer } from '../inversify.config';
import { TYPES } from '@product-comparison/container';

@Injectable({providedIn: 'root'})
export class Di {
  private readonly container = myContainer;

  getUseCase(): ProductUseCase {
    return this.container.get<ProductUseCase>(TYPES.ProductUseCase);
  }
}


