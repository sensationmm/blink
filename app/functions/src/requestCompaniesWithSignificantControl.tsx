const corporateEntitiesWithSignificantControlServerFunctions = require('firebase-functions');
const corporateEntitiesWithSignificantControlCors = require('cors');
const corporateEntitiesWithSignificantControlExpress = require('express');
const corporateEntitiesWithSignificantControlServerRequest = require('request');

const corporateEntitiesWithSignificantControlServer = corporateEntitiesWithSignificantControlExpress();

corporateEntitiesWithSignificantControlServer.use(corporateEntitiesWithSignificantControlCors());

corporateEntitiesWithSignificantControlServer.get('*/:companyId/:psc_id', function (req: any, res: any) {

    const { companyId, psc_id } = req.params;

    console.log("companyId", companyId);
    console.log("psc_id", psc_id);

    const headerOption = {
        "url": `https://api.companieshouse.gov.uk/company/${companyId}/persons-with-significant-control/corporate-entity/${psc_id}`,
        "headers": {
            "Authorization": `${process.env.COMPANIES_HOUSE_API_KEY || corporateEntitiesWithSignificantControlServerFunctions.config().companies_house_api.key}`
        }
    };

    corporateEntitiesWithSignificantControlServerRequest(headerOption, function (error: any, response: any, body: any) {
        // console.log("Body:", body);
        res.send(JSON.parse(body))
    }
    );
})

module.exports = corporateEntitiesWithSignificantControlServerFunctions.https.onRequest(corporateEntitiesWithSignificantControlServer)