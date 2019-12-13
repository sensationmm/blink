const functions = require('firebase-functions');
const searchCompanyCors = require('cors');
const searchCompanyExpress = require('express');
const searchCompanyRequest = require('request');

const searchCompanyServer = searchCompanyExpress();

searchCompanyServer.use(searchCompanyCors());

searchCompanyServer.get('*/:query', function (req: any, res: any) {

    const { query } = req.params;

    console.log("query", query);

    const headerOption = {
        "body": { q: query },
        "url": `https://api.companieshouse.gov.uk/search/companies`,
        "headers": {
            "Authorization": `${process.env.COMPANIES_HOUSE_API_KEY || functions.config().companies_house_api.key}`
        }
    };

    searchCompanyRequest.post(headerOption, function (error: any, response: any, body: any) {
        // console.log("Body:", body);
        res.send(JSON.parse(body))
    }
    );
})

module.exports = functions.https.onRequest(searchCompanyServer)