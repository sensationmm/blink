const truliooIDVFunctions = require('firebase-functions');
const truliooIDVCors = require('cors');
const truliooIDVExpress = require('express');
const truliooIDVRequest = require('request');

const truliooIDVServer = truliooIDVExpress();

truliooIDVServer.use(truliooIDVCors());

truliooIDVServer.get('*/:countryCode', function (req: any, res: any) {

    const { countryCode } = req.params;
    
    const headerOption = {
        "url": `https://gateway.trulioo.com/trial/configuration/v1/testentities/Identity Verification/${countryCode}`,
        "headers": {
            "x-trulioo-api-key": `${process.env.TRULIOO_API_KEY || truliooIDVFunctions.config().trulioo_api.key}`
        }
    };

    // ["AU","AT","DK","NO","SE","TR","BR","BE","DE","NL","GB","US","MY","RU"]

    truliooIDVRequest(headerOption, function (error: any, response: any, body: any) {
        if (error) {
            console.log(error)
        }
        console.log("Body:", body);
        res.send(JSON.parse(body))
    }
    );
})

module.exports = truliooIDVFunctions.https.onRequest(truliooIDVServer)