const truliooFunctions = require('firebase-functions');
const truliooSearchCompanyCors = require('cors');
const truliooSearchCompanyExpress = require('express');
const truliooSearchCompanyRequest = require('request');

const truliooSearchCompanyServer = truliooSearchCompanyExpress();

truliooSearchCompanyServer.use(truliooSearchCompanyCors());

truliooSearchCompanyServer.get('*/:query', function (req: any, res: any) {

    // const { query } = req.params;
    
    const headerOption = {
        // "url": `https://api.globaldatacompany.com/connection/v1/sayhello/${query}`,
        "url": "https://gateway.trulioo.com/trial/connection/v1/testauthentication",
        "headers": {
            "x-trulioo-api-key": `${process.env.TRULIOO_API_KEY || truliooFunctions.config().trulioo_api.key}`,
            // "Authorization": `${process.env.TRULIOO_API_KEY || truliooFunctions.config().trulioo_api.key}`
        }
    };

    console.log("api key", truliooFunctions.config().trulioo_api.key)

    truliooSearchCompanyRequest(headerOption, function (error: any, response: any, body: any) {
        if (error) {
            console.log(error)
        }
        console.log("Body:", body);
        res.send(JSON.parse(body))
    }
    );
})

module.exports = truliooFunctions.https.onRequest(truliooSearchCompanyServer)