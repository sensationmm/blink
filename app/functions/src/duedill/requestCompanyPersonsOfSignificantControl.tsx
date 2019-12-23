const duedillCompanyPersonsOfSignificantControlFunctions = require('firebase-functions');
const duedillCompanyPersonsOfSignificantControlCors = require('cors');
const duedillCompanyPersonsOfSignificantControlExpress = require('express');
const duedillCompanyPersonsOfSignificantControlRequest = require('request');

const duedillCompanyPersonsOfSignificantControlServer = duedillCompanyPersonsOfSignificantControlExpress();

duedillCompanyPersonsOfSignificantControlServer.use(duedillCompanyPersonsOfSignificantControlCors());

duedillCompanyPersonsOfSignificantControlServer.get('*/:countryCode/:companyId', function (req: any, res: any) {

    const { companyId, countryCode, limit } = req.params;

    const options = {
        "headers": {
            "Accept": "application/json",
            // 'Authorization': `${process.env.DUE_DILL_API_KEY || duedillCompanyPersonsOfSignificantControlFunctions.config().due_dill_api.key}`,
            "X-AUTH-TOKEN": `${process.env.DUE_DILL_API_KEY || duedillCompanyPersonsOfSignificantControlFunctions.config().due_dill_api.key}`
        },
        "url": `https://duedil.io/v4/company/${countryCode}/${companyId}/persons-significant-control.json?limit=${limit || 50}`,
        "credentials": 'include'
    };

    duedillCompanyPersonsOfSignificantControlRequest(options, function (error:any, response:any, body:any) {
        if (error) {
            console.log("error", error);
        }
        res.send(body);
    })
})

module.exports = duedillCompanyPersonsOfSignificantControlFunctions.https.onRequest(duedillCompanyPersonsOfSignificantControlServer)