const officersFunctions = require('firebase-functions');
const officersCors = require('cors');
const officersExpress = require('express');
const officersRequest = require('request');

const officersServer = officersExpress();

officersServer.use(officersCors());

officersServer.get('*/:companyId', function (req: any, res: any) {

    const { companyId } = req.params;

    console.log("companyId", companyId);

    const headerOption = {
        "url": `https://api.companieshouse.gov.uk/company/${companyId}/officers`,
        "headers": {
            "Authorization": `${process.env.COMPANIES_HOUSE_API_KEY || officersFunctions.config().companies_house_api.key}`
        }
    };

    officersRequest(headerOption, function (error: any, response: any, body: any) {
        // console.log("Body:", body);
        res.send(JSON.parse(body))
    }
    );
})

module.exports = officersFunctions.https.onRequest(officersServer)