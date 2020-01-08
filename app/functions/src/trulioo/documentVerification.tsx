const truliooDocVFunctions = require('firebase-functions');
const truliooDocVCors = require('cors');
const truliooDocVExpress = require('express');
const truliooDocVBodyParser = require("body-parser");
const truliooDocVRequest = require('request');
const truliooDocVServer = truliooDocVExpress();
truliooDocVServer.use(truliooDocVBodyParser.urlencoded({ extended: false }));
truliooDocVServer.use(truliooDocVBodyParser.json());
truliooDocVServer.use(truliooDocVCors());
truliooDocVServer.post('*/', function (req: any, res: any) {


    const payload = { 
        "AcceptTruliooTermsAndConditions": true, 
        "CleansedAddress": false, 
        "VerboseMode": true, 
        "CallBackUrl": "https://api.globaldatacompany.com/connection/v1/async-callback", 
        "ConfigurationName": "Document Verification", 
        "CountryCode": req.body.countryCode, 
        "DataFields": { 
            "PersonInfo": { 
                "FirstGivenName": "Nick", 
                "FirstSurName": "Procopiou" 
            }, 
            "Document": { 
                "DocumentType": "Passport", 
                "DocumentFrontImage": req.body.documentUrl
            } 
        } 
    }

    truliooDocVRequest.post({
        "url": `https://gateway.trulioo.com/trial/verifications/v1/verify`,
        "headers": {
            "x-trulioo-api-key": `${process.env.TRULIOO_API_KEY || truliooDocVFunctions.config().trulioo_api.key}`
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




module.exports = truliooDocVFunctions.https.onRequest(truliooDocVServer)