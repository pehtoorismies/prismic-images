# Env

```
CLIENT_EMAIL=
PRIVATE_KEY=
SPREADSHEET_ID=
```
See Keybase for file contents

# Deploy

```
sls deploy
```

## Local development

1. `File --> Copy` google sheet and add to your account. 
2. Add your new spreadsheet id to `.env` (`SPREADSHEET_ID=`)
3. Share document with: `cloudfunction-user@festive-airway-216914.iam.gserviceaccount.com`
4. `yarn develop` to start local server
