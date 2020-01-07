const truliooIDVCountryCodesFunctions = require('firebase-functions');
const truliooIDVCountryCodesCors = require('cors');
const truliooIDVCountryCodesExpress = require('express');
const truliooIDVCountryCodesRequest = require('request');

const truliooIDVCountryCodesServer = truliooIDVCountryCodesExpress();

truliooIDVCountryCodesServer.use(truliooIDVCountryCodesCors());

truliooIDVCountryCodesServer.get('*/', function (req: any, res: any) {

    const headerOption = {
        "url": "https://gateway.trulioo.com/trial/configuration/v1/countrycodes/Identity Verification",
        "headers": {
            "x-trulioo-api-key": `${process.env.TRULIOO_API_KEY || truliooIDVCountryCodesFunctions.config().trulioo_api.key}`
        }
    };

    truliooIDVCountryCodesRequest(headerOption, function (error: any, response: any, body: any) {
        if (error) {
            console.log(error)
        }
        console.log("Body:", body);
        res.send(JSON.parse(body))
    }
    );
})

module.exports = truliooIDVCountryCodesFunctions.https.onRequest(truliooIDVCountryCodesServer)