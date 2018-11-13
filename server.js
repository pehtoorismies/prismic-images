import express from 'express';
import dotenv from 'dotenv';
import parser from './src/ruleparser';
import fetchSheets from './src/sheets-fetcher';

dotenv.config();

const app = express();
app.set('json spaces', 2);
const port = 3009;

app.get('/', async (req, res) => {
  const data = await fetchSheets();
  const parsed = parser(data);
  res.setHeader('Content-Type', 'application/json');
  res.json(parsed);
});

app.listen(port, () => console.log(`Listening on port ${port}!`));
