const truliooDocVTypesFunctions = require('firebase-functions');
const truliooDocVTypesCors = require('cors');
const truliooDocVTypesExpress = require('express');
const truliooDocVTypesRequest = require('request');

const truliooDocVTypesServer = truliooDocVTypesExpress();

truliooDocVTypesServer.use(truliooDocVTypesCors());

truliooDocVTypesServer.get('*/:countryCode', function (req: any, res: any) {

    const { countryCode } = req.params;

    const headerOption = {
        "url": `https://gateway.trulioo.com/trial/configuration/v1/documentTypes/${countryCode}`,
        "headers": {
            "x-trulioo-api-key": `${process.env.TRULIOO_API_KEY || truliooDocVTypesFunctions.config().trulioo_api.key}`
        }
    };

    truliooDocVTypesRequest(headerOption, function (error: any, response: any, body: any) {
        if (error) {
            console.log(error)
        }
        console.log("Body:", body);
        res.send(JSON.parse(body))
    }
    );
})

module.exports = truliooDocVTypesFunctions.https.onRequest(truliooDocVTypesServer)