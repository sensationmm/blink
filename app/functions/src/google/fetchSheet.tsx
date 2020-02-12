export { }

const functions = require('firebase-functions');
const cors = require('cors');
const express = require('express');
const server = express();
const { GoogleSpreadsheet } = require('google-spreadsheet');

server.use(cors());
server.post('*/', async function (req: any, res: any) {
    const { sheetID, tabID } = req.body;

    const doc = new GoogleSpreadsheet(sheetID);

    await doc.useServiceAccountAuth({
        client_email: process.env.APP_GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: process.env.APP_GOOGLE_PRIVATE_KEY,
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

    return res.send(sheetJSON);
});
module.exports = functions.https.onRequest(server);
