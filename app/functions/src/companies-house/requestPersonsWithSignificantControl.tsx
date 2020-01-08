const personsWithSignificantControlFunctions = require('firebase-functions');
const personsWithSignificantControlAdmin = require("firebase-admin");
const personsWithSignificantControlCors = require('cors');
const personsWithSignificantControlExpress = require('express');
const personsWithSignificantControlServerRequest = require('request');

const personsWithSignificantControlServer = personsWithSignificantControlExpress();

personsWithSignificantControlServer.use(personsWithSignificantControlCors());

personsWithSignificantControlServer.get('*/:companyId', function (req: any, res: any) {

    const { companyId } = req.params;


    return personsWithSignificantControlAdmin.database().ref(`/shareholders${companyId}`).once('value').then((snapshot: any) => {
        if (snapshot) {
            const personsWithSignificantControl = snapshot.val();
            console.log("personsWithSignificantControl", personsWithSignificantControl);

        } else {
            const headerOption = {
                "url": `https://api.companieshouse.gov.uk/company/${companyId}/persons-with-significant-control`,
                "headers": {
                    "Authorization": `${process.env.COMPANIES_HOUSE_API_KEY || personsWithSignificantControlFunctions.config().companies_house_api.key}`
                }
            };
        
            personsWithSignificantControlServerRequest(headerOption, function (error: any, response: any, body: any) {
                // console.log("Body:", body);
                res.send(JSON.parse(body))
            });
        }
      });
})

module.exports = personsWithSignificantControlFunctions.https.onRequest(personsWithSignificantControlServer)