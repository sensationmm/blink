const truliooDocVCountryCodesFunctions = require('firebase-functions');
const truliooDocVCountryCodesCors = require('cors');
const truliooDocVCountryCodesExpress = require('express');
const truliooDocVCountryCodesRequest = require('request');

const truliooCountryCodesServer = truliooDocVCountryCodesExpress();

truliooCountryCodesServer.use(truliooDocVCountryCodesCors());

truliooCountryCodesServer.get('*/', function (req: any, res: any) {

    const headerOption = {
        "url": "https://gateway.trulioo.com/trial/configuration/v1/countrycodes/Document Verification",
        "headers": {
            "x-trulioo-api-key": `${process.env.TRULIOO_API_KEY || truliooDocVCountryCodesFunctions.config().trulioo_api.key}`
        }
    };

    truliooDocVCountryCodesRequest(headerOption, function (error: any, response: any, body: any) {
        if (error) {
            console.log(error)
        }
        console.log("Body:", body);
        res.send(JSON.parse(body))
    }
    );
})

module.exports = truliooDocVCountryCodesFunctions.https.onRequest(truliooCountryCodesServer)