import express from 'express';
import dotenv from 'dotenv';
import parser from './src/ruleparser';
import fetchSheets from './src/sheets-fetcher';

dotenv.config();

const app = express();
const port = 3009;

app.get('/', async (req, res) => {
  const data = await fetchSheets();
  const parsed = parser(data);
  res.json(parsed);
});

app.listen(port, () => console.log(`Listening on port ${port}!`));
