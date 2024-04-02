/** @type {import('mock-config-server').MockServerConfig} */
const mockServerConfig = {
  database: {
    data: {
      products: [
        {isin: 123, id:123, cap: 50, baseCurrency: 'EUR', name: 'ETF 1', invType: 0, wkn: 'ahf56a'},
        {isin: 124, id:124, cap: 1, baseCurrency: 'EUR', name: 'ETF 2', invType: 0, wkn: 'and67b'},
        {isin: 321, id:321, cap: 150, baseCurrency: 'USD', fundname: 'Fund 1', invType: 1, rating: 5},
        {isin: 678, id:678, cap: 27, baseCurrency: 'EUR', fundname: 'Fund 2', invType: 1, rating: 2},
      ],
    },
    routes: {
      '/api/products/:id': '/products/:id',
    }
  },
};

export default mockServerConfig;
