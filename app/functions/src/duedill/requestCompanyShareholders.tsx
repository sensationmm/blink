const duedillCompanyShareholdersFunctions = require('firebase-functions');
const duedillCompanyShareholdersCors = require('cors');
const duedillCompanyShareholdersExpress = require('express');
const duedillCompanyShareholdersRequest = require('request');

const duedillCompanyShareholdersServer = duedillCompanyShareholdersExpress();

duedillCompanyShareholdersServer.use(duedillCompanyShareholdersCors());

duedillCompanyShareholdersServer.get('*/:countryCode/:companyId', function (req: any, res: any) {

    const { companyId, countryCode } = req.params;

    console.log("companyId", companyId);

    console.log("countryCode", countryCode)

    console.log("DUE_DILL_API_KEY", process.env.DUE_DILL_API_KEY || duedillCompanyShareholdersFunctions.config().due_dill_api.key)

    const headerOption = {
        "url": `https://api.companieshouse.gov.uk/company/${countryCode}/${companyId}/shareholders.json`,
        "headers": {
            "X-AUTH-TOKEN": `${process.env.DUE_DILL_API_KEY || duedillCompanyShareholdersFunctions.config().due_dill_api.key}`
        }
    };

    duedillCompanyShareholdersRequest(headerOption, function (error: any, response: any, body: any) {
        res.send(JSON.parse(body))
    });
})

module.exports = duedillCompanyShareholdersFunctions.https.onRequest(duedillCompanyShareholdersServer)