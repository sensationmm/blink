const duedillCompanyShareholdersFunctions = require('firebase-functions');
const duedillCompanyShareholdersCors = require('cors');
const duedillCompanyShareholdersExpress = require('express');
const duedillCompanyShareholdersRequest = require('request');

const duedillCompanyShareholdersServer = duedillCompanyShareholdersExpress();

duedillCompanyShareholdersServer.use(duedillCompanyShareholdersCors());

duedillCompanyShareholdersServer.get('*/:countryCode/:companyId', function (req: any, res: any) {

    const { companyId, countryCode } = req.params;

    const options = {
        "headers": {
            "Accept": "application/json",
            'Authorization': `${process.env.DUE_DILL_API_KEY || duedillCompanyShareholdersFunctions.config().due_dill_api.key}`,
            // "X-AUTH-TOKEN": `${process.env.DUE_DILL_API_KEY || duedillCompanyShareholdersFunctions.config().due_dill_api.key}`
        },
        "url": `https://duedil.io/v4/company/${countryCode}/${companyId}/shareholders.json`,
        "credentials": 'include'
    };

    duedillCompanyShareholdersRequest(options, function (error, response, body) {
        if (error) {
            console.log("error", error);
        }
        console.log("body", body);
        res.send(body);
    })
})

module.exports = duedillCompanyShareholdersFunctions.https.onRequest(duedillCompanyShareholdersServer)