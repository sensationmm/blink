export { }
const functions = require('firebase-functions');
const cors = require('cors');
const express = require('express');
const request = require('request');

const server = express();

server.use(cors());

const requestCompanyVitals = (companyId: any, countryCode: any) => {

    return new Promise(resolve => {
        request.get({
            headers: { "X-AUTH-TOKEN": `${process.env.DUE_DILL_API_KEY || functions.config().due_dill_api.key}` },
            "url": `https://duedil.io/v4/company/${countryCode}/${companyId}.json?limit=50`,
        }, function (error: any, response: any, body: any) {
            if (error) {
                console.log("error", error);
            }
            resolve(body)
        });
    })
}



server.get('*/:companyId/:countryCode', async function (req: any, res: any) {

    const { companyId, countryCode } = req.params;
    console.log("countryCode", countryCode)
    const body: any = await requestCompanyVitals(companyId, countryCode);
    if (body?.httpCode !== 404) {
        res.send(body)
    }
})

module.exports = functions.https.onRequest(server);

module.exports.requestCompanyVitals = requestCompanyVitals;