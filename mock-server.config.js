/** @type {import('mock-config-server').MockServerConfig} */
const mockServerConfig = {
  database: {
    data: {
      products: [
        {isin: 123, id:123, cap: 50, baseCurrency: 'EUR', name: 'ETF 1', investmentType: 'etf', wkn: 'ahf56a'},
        {isin: 124, id:124, cap: 1, baseCurrency: 'EUR', name: 'ETF 2', investmentType: 'etf', wkn: 'and67b'},
        {isin: 321, id:321, cap: 150, baseCurrency: 'USD', name: 'Fund 1', investmentType: 'fund', rating: 5},
        {isin: 678, id:678, cap: 27, baseCurrency: 'EUR', name: 'Fund 2', investmentType: 'fund', rating: 2},
      ],
    },
    routes: {
      '/api/products/:id': '/products/:id',
    }
  },
};

export default mockServerConfig;
