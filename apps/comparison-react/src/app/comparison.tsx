import { Product } from '@product-comparison/product-core';
import { useEffect, useState } from 'react';
import { productState } from './app';
import { IconButton } from './icon-button';

export function Comparison() {
  const {products, productRemoved, reorder} = useProducts();

  const reorderLeft = (index: number) => {
    if (index < 1 || index >= products?.length) {
      return;
    }

    reorder(index, index - 1);
  };

  const reorderRight = (index: number) => {
    if (index < 0 || index >= products?.length - 1) {
      return;
    }

    reorder(index, index + 1);
  };

  return <div>
    <div className='flex gap-1 w-full'>
      {products?.map((p, index) => <ProductCard key={p.isin} product={p} productRemoved={productRemoved} productReorderedLeft={() => reorderLeft(index)} productReorderedRight={() => reorderRight(index)} />)}
    </div>

    <table className='w-full mt-8 table-fixed'>
      <thead>
        <tr className='border-b'>
          {products?.map(p => <th className='p-3' key={p.isin}>{p.name}</th>)}
        </tr>
      </thead>
      <tbody>
        <tr className='border-b'>
          {products?.map(p => <td className='p-3' key={p.isin}>{p.investmentType}</td>)}
        </tr>
        <tr className='border-b'>
          {products?.map(p => <td className='p-3' key={p.isin}>{p.isin}</td>)}
        </tr>
        <tr className='border-b'>
          {products?.map(p => <td className='p-3' key={p.isin}>{p.cap > 50 ? 'Yes' : 'No'}</td>)}
        </tr>
      </tbody>
    </table>
  </div>;
}

function ProductCard({
  product,
  productRemoved,
  productReorderedLeft,
  productReorderedRight,
}: {
  product: Product,
  productRemoved: (isin: number) => void,
  productReorderedLeft: () => void,
  productReorderedRight: () => void,
}) {
  return <div className='rounded-md border border-gray-300 flex-1 p-2 text-center'>
    <div className='flex justify-between align-center'>
      <span>{product.name}</span>
      <IconButton onClick={() => productRemoved(product.isin)}>X</IconButton>
    </div>

    <div className='flex gap-2 justify-center pt-5'>
      <IconButton onClick={productReorderedLeft}>{'<'}</IconButton>
      <IconButton onClick={productReorderedRight}>{'>'}</IconButton>
    </div>
  </div>;
}

function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const subscription = productState.getProducts().subscribe(data => {
      setProducts(data);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const productRemoved = async (isin: number) => {
    await productState.removeProduct(isin);
  }

  const reorder = async (from: number, to: number) => {
    await productState.reorderProducts(from, to);
  };

  return {products, productRemoved, reorder};
}
