import dotenv from 'dotenv'
import cors from 'cors'
import * as R from 'ramda'

import fetchSheets from "./src/sheets-fetcher";
import parser from './src/ruleparser'

dotenv.config()
const corsHandler = cors()

exports.rules = async (req, res) => {
  corsHandler(req, res, async () => {
    const data = await fetchSheets()
    const parsed = parser(data)
    res.set('Content-Type', 'application/json')
    if (req.query && req.query.challenge) {
      const challenge = R.find(R.propEq('id', `challenge_${req.query.challenge}`), parsed.challenges)
      return res.status(200).send(JSON.stringify(challenge))
    }
    return res.status(200).send(JSON.stringify(parsed))
  })
};
