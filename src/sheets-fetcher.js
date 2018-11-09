import { google } from 'googleapis';

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
  const sheetData = {};
  sheetData.phases = await fetchSheetData('phases!a1:e512');
  sheetData.leadershipStyles = await fetchSheetData(
    'leadership_styles!a1:h512'
  );
  sheetData.priorities = await fetchSheetData('priorities!a1:h512');
  sheetData.occurrences = await fetchSheetData('random_events!a1:j512');
  sheetData.traits = await fetchSheetData('traits!a1:h512');
  sheetData.actions = await fetchSheetData('actions!a1:h512');
  sheetData.pawns = await fetchSheetData('pawns!a1:g512');
  sheetData.challenges = await fetchSheetData('challenges!a1:l512');
  return sheetData;
};

export default fetchSheets;
