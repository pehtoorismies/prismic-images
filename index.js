import dotenv from 'dotenv'
import cors from 'cors'
// import * as R from 'ramda'

import fetchSheets from "./src/sheets-fetcher";
import parser from './src/ruleparser'

dotenv.config()

exports.rules = async (req, res) => {
  const corsHandler = cors()
  corsHandler(req, res, async () => {
    const data = await fetchSheets()
    const parsed = parser(data)
    return res.status(200).send(JSON.stringify(parsed))
  })
};

/* const challenges = async (req, res) => {
  const parsed = await fetchSheets()
  const data = parser(parsed)
  console.log(JSON.stringify(req))
  const challengeId = `challenge_${req.param('id')}`
  const challenge = R.find(R.propEq('id', challengeId), data.challenges)
  return res.status(200).send(JSON.stringify(challenge))
} */
