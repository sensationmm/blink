const truliooBusinessSearchFunctions = require('firebase-functions');
const truliooBusinessSearchCors = require('cors');
const truliooBusinessSearchExpress = require('express');
const truliooBusinessSearchBodyParser = require("body-parser");
const truliooBusinessSearchRequest = require('request');
const truliooBusinessSearchServer = truliooBusinessSearchExpress();
truliooBusinessSearchServer.use(truliooBusinessSearchBodyParser.urlencoded({ extended: false }));
truliooBusinessSearchServer.use(truliooBusinessSearchBodyParser.json());
truliooBusinessSearchServer.use(truliooBusinessSearchCors());
truliooBusinessSearchServer.get('*/', function (req: any, res: any) {


    const payload = {
        "AcceptTruliooTermsAndConditions": true,
        "Business": {
            "BusinessName": "Deliveroo",
            // "JurisdictionOfIncorporation": "BC"
        },
        "CountryCode": "UK"
    }


    truliooBusinessSearchRequest.post({
        // "url": `https://api.globaldatacompany.com/trial/business/v1/search`,
        "url": `https://gateway.trulioo.com/trial/business/v1/search`,
        // "url": `https://gateway.trulioo.com/trial/verifications/v1/verify`,
        "headers": {
            "x-trulioo-api-key": `${process.env.TRULIOO_API_KEY || truliooBusinessSearchFunctions.config().trulioo_api.key}`
        },
        body: JSON.stringify(payload)
    }, function (error: any, response: any, body: any) {
        if (error) {
            console.log("error", error);
        }
        console.log("response", response);
        res.send(body)
    });
})




module.exports = truliooBusinessSearchFunctions.https.onRequest(truliooBusinessSearchServer)