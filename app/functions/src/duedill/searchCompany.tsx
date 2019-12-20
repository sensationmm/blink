const duedillFunctions = require('firebase-functions');
const duedillCompanyCors = require('cors');
const duedillCompanyExpress = require('express');
const duedillCompanyRequest = require('request');

const duedillCompanyServer = duedillCompanyExpress();

duedillCompanyServer.use(duedillCompanyCors());

duedillCompanyServer.get('*/:query/:countryCodes', function (req: any, res: any) {

    const { query, countryCodes } = req.params;

    const body = {
        criteria: {
            name: query,
            countryCodes: { values: countryCodes, mode: "any" }
        }
    }


    console.log("api key", duedillFunctions.config().due_dill_api.key);

    duedillCompanyRequest.post({
        headers: { "X-AUTH-TOKEN": `${process.env.DUE_DILL_API_KEY || duedillFunctions.config().due_dill_api.key}` },
        url: 'https://duedil.io/v4/search/companies.json',
        body: JSON.stringify(body)
    }, function (error: any, response: any, body: any) {
        if (error) {
            console.log("error", error);
        }
        console.log("response", response);
        res.send(body)
    });
})

module.exports = duedillFunctions.https.onRequest(duedillCompanyServer)