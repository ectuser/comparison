import { HistoryState } from '@product-comparison/history-state';
import { ProductHistoryInteractor, ProductHistoryLocalstorageRepository } from '@product-comparison/product-history';
import { useEffect, useState } from 'react';
import { productState } from './app';
import { LocalStorage } from '@product-comparison/localstorage';

const historyRepo = new ProductHistoryLocalstorageRepository(new LocalStorage());
const historyInteractor = new ProductHistoryInteractor(historyRepo);

const historyState = new HistoryState(historyInteractor);

function History(props: {historySelected: (query: string) => void;}) {
  const [history, setHistory] = useState<string[]>([]);

  useEffect(() => {
    const subscription = historyState.getHistory().subscribe(data => {
      setHistory(data);
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const search = (query: string) => {
    props.historySelected(query);
  };

  return <div>
    {
    history.length ? <>
      <h2 className='md:text-1xl lg:text-2xl'>Search history:</h2>

      <div className='flex flex-col gap-1'>
        {history.map(item => <div key={item}><button className='text-blue-500 hover:underline' onClick={() => search(item)}>{item}</button></div>)}
      </div>
    </> : null}
  </div>;
}

export function Search() {
  const [search, setSearch] = useState('');

  const submit = async () => {
    const numQuery = Number(search);

    if (isNaN(numQuery)) {
      return;
    }

    try {
      await productState.addProduct(numQuery);

      setSearch('');

      await historyState.addHistory(search);
    } catch (error) {
      console.log('Error: ', error);

    }
  }

  const historySelected = async (query: string) => {
    setSearch(query);

    await submit();
  };

  return <>
    <div className='flex items-center gap-2'>
      <span>
        <input id='search' className='p-2 bg-gray-50 border border-blue-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500' type="text" onChange={(ev) => setSearch(ev.target.value)} value={search} placeholder='Search' />
      </span>
      <button className='bg-blue-500 text-white font-bold py-2 px-4 rounded-lg' onClick={submit}>Submit</button>
    </div>
    <div className='pt-3'>
      <History historySelected={historySelected} />
    </div>
  </>;
}
