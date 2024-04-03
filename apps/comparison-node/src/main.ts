import express from 'express';

import { compareProducts } from './compare-products';

const host = process.env.HOST ?? 'localhost';
const port = process.env.PORT ? Number(process.env.PORT) : 3000;

const app = express();

app.get('/', async (req, res) => {
  const isins = ((req?.query?.isins || []) as string[]).map(isin => Number(isin));

  const result = await compareProducts(isins);

  res.send({ result });
});

app.listen(port, host, () => {
  console.log(`[ ready ] http://${host}:${port}`);
});
