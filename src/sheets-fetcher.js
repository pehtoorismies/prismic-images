import { google } from 'googleapis';

const scopes = ['https://www.googleapis.com/auth/spreadsheets.readonly'].join(
  ' '
);

const fetchSheetData = async (client, range) => {
  const spreadsheetId = process.env.SPREADSHEET_ID;

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
  const clientEmail = process.env.CLIENT_EMAIL;
  const privateKey = process.env.PRIVATE_KEY.replace(/\\n/g, '\n');

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

  const sheetData = {};
  sheetData.phases = await fetchSheetData(client, 'phases!a1:e128');
  sheetData.leadershipStyles = await fetchSheetData(
    client,
    'leadership_styles!a1:h128'
  );
  sheetData.priorities = await fetchSheetData(client, 'priorities!a1:h128');
  sheetData.occurrences = await fetchSheetData(client, 'random_events!a1:j128');
  sheetData.traits = await fetchSheetData(client, 'traits!a1:h128');
  sheetData.actions = await fetchSheetData(client, 'actions!a1:i128');
  sheetData.pawns = await fetchSheetData(client, 'pawns!a1:h128');
  sheetData.challenges = await fetchSheetData(client, 'challenges!a1:l128');
  return sheetData;
};

export default fetchSheets;
