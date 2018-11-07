import { google } from 'googleapis';
// const google = require('googleapis')

const scopes = ['https://www.googleapis.com/auth/spreadsheets.readonly'].join(
  ' '
);

const fetchSheetData = async range => {
  const clientEmail = process.env.CLIENT_EMAIL;
  const privateKey = process.env.PRIVATE_KEY.replace(/\\n/g, '\n');
  const spreadsheetId = process.env.SPREADSHEET_ID;

  const client = await google.auth
    .getClient({
      credentials: {
        client_email: clientEmail,
        private_key: privateKey,
      },
      scopes,
    })
    .catch(e => {
      console.error('ERROR', e);
    });

  const opts = {
    auth: client,
    spreadsheetId,
    range,
  };

  const sheets = google.sheets('v4');
  const res = await sheets.spreadsheets.values.get(opts);
  const { values } = res.data;
  return values;
};

const fetchSheets = async () => {
  const sheetData = await fetchSheetData('phases!a1:e4');
  return sheetData;
};

export default fetchSheets;
