const companyFunctions = require('firebase-functions');
const companyCors = require('cors');
const companyExpress = require('express');
const request = require('request');

const companyServer = companyExpress();

companyServer.use(companyCors());

companyServer.get('*/:companyId', function (req: any, res: any) {

    const { companyId } = req.params;

    console.log("companyId", companyId);

    const headerOption = {
        "url": `https://api.companieshouse.gov.uk/company/${companyId}`,
        "headers": {
            "Authorization": `${process.env.COMPANIES_HOUSE_API_KEY || companyFunctions.config().companies_house_api.key}`
        }
    };

    request(headerOption, function (error: any, response: any, body: any) {
        // console.log("Body:", body);
        res.send(JSON.parse(body))
    }
    );
})

module.exports = functions.https.onRequest(companyServer)