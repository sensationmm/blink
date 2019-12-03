const functions = require('firebase-functions');
const companyCors = require('cors');
const companyExpress = require('express');
const request = require('request');

const companyServer = companyExpress();

companyServer.use(companyCors());

companyServer.get('/company/:companyId', function (req: any, res: any) {

    const { companyId } = req.params;

    console.log("company/companyId", companyId);

    const headerOption = {
        "url": `https://api.companieshouse.gov.uk/company/${companyId}`,
        "headers": {
            "Authorization": `${functions.config().companies_house_api.key || process.env.COMPANIES_HOUSE_API_KEY}`
        }
    };

    request(headerOption, function (error: any, response: any, body: any) {
        // console.log("Body:", body);
        res.send(JSON.parse(body))
    }
    );
})

module.exports = functions.https.onRequest(companyServer)