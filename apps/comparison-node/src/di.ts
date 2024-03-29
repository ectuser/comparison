import { TYPES } from '@product-comparison/container';
import { myContainer } from './inversify.config';
import { ProductUseCase } from '@product-comparison/product-core';

export const useCase = myContainer.get<ProductUseCase>(TYPES.ProductUseCase);
