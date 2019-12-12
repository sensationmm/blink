const functions = require('firebase-functions');
const personsWithSignificantControlCors = require('cors');
const personsWithSignificantControlExpress = require('express');
const request = require('request');

const companyServer = personsWithSignificantControlExpress();

companyServer.use(personsWithSignificantControlCors());

companyServer.get('*/:companyId', function (req: any, res: any) {

    const { companyId } = req.params;

    console.log("companyId", companyId);

    const headerOption = {
        "url": `https://api.companieshouse.gov.uk/${companyId}/persons-with-significant-control`,
        "headers": {
            "Authorization": `${process.env.COMPANIES_HOUSE_API_KEY || functions.config().companies_house_api.key}`
        }
    };

    request(headerOption, function (error: any, response: any, body: any) {
        // console.log("Body:", body);
        res.send(JSON.parse(body))
    }
    );
})

module.exports = functions.https.onRequest(companyServer)