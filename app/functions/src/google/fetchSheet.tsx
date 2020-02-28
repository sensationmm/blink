export { }

const functions = require('firebase-functions');
const cors = require('cors');
const express = require('express');
const server = express();
const { GoogleSpreadsheet } = require('google-spreadsheet');

server.use(cors());

const fetchGoogleSheet = async (sheetID: string, tabID: string = '0') => {
    const doc = new GoogleSpreadsheet(sheetID);

    console.log(functions.config().app_google_service_account_email, functions.config().app_google_private_key.key);

    await doc.useServiceAccountAuth({
        private_key: (`-----BEGIN PRIVATE KEY-----\n${process.env.APP_GOOGLE_PRIVATE_KEY || functions.config().app_google_private_key.key}\n-----END PRIVATE KEY-----\n`).replace(/\\n/g, '\n'),
        client_email: process.env.APP_GOOGLE_SERVICE_ACCOUNT_EMAIL || functions.config().app_google_service_account_email.key
    });

    await doc.loadInfo();

    const sheet = await doc.sheetsById[tabID].getRows();

    let cache: Array<string> | null = [];
    const sheetJSON = JSON.stringify(sheet, function (key, value) {
        if (typeof value === 'object' && value !== null) {
            if (Array.isArray(cache) && cache.indexOf(value) !== -1) {
                // Duplicate reference found, discard key
                return;
            }
            // Store value in our collection
            Array.isArray(cache) && cache.push(value);
        }
        return value;
    });
    cache = null;

    return sheetJSON;
}

server.post('*/', async function (req: any, res: any) {
    const { sheetID, tabID } = req.body;

    const sheet = await fetchGoogleSheet(sheetID, tabID);

    return res.send(sheet);
});

module.exports = functions.https.onRequest(server);

module.exports.fetchGoogleSheet = fetchGoogleSheet;
