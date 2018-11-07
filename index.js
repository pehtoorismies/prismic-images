import dotenv from 'dotenv'

import fetchSheets from "./src/sheets-fetcher";
import parser from './src/ruleparser'

dotenv.config()

const rules = async (req, res) => {
  const parsed = await fetchSheets()
  const data = parser(parsed)
  return res.status(200).send(JSON.stringify(data))
};

export { rules }