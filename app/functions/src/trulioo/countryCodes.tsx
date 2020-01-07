const truliooCountryCodesFunctions = require('firebase-functions');
const truliooCountryCodesCors = require('cors');
const truliooCountryCodesExpress = require('express');
const truliooCountryCodesRequest = require('request');

const truliooCountryCodesServer = truliooCountryCodesExpress();

truliooCountryCodesServer.use(truliooCountryCodesCors());

truliooCountryCodesServer.get('*/', function (req: any, res: any) {

    const headerOption = {
        "url": "https://gateway.trulioo.com/trial/configuration/v1/countrycodes/Identity Verification",
        "headers": {
            "x-trulioo-api-key": `${process.env.TRULIOO_API_KEY || truliooCountryCodesFunctions.config().trulioo_api.key}`
        }
    };

    truliooCountryCodesRequest(headerOption, function (error: any, response: any, body: any) {
        if (error) {
            console.log(error)
        }
        console.log("Body:", body);
        res.send(JSON.parse(body))
    }
    );
})

module.exports = truliooCountryCodesFunctions.https.onRequest(truliooCountryCodesServer)