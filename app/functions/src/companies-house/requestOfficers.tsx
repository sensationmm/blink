// const officersFunctions = require('firebase-functions');
// const officersCors = require('cors');
// const officersExpress = require('express');
// const officersRequest = require('request');

// const officersServer = officersExpress();

// officersServer.use(officersCors());

// officersServer.get('*/:companyId', function (req: any, res: any) {

//     const { companyId } = req.params;

//     console.log("companyId", companyId);

//     const headerOption = {
//         "url": `https://api.companieshouse.gov.uk/company/${companyId}/officers`,
//         "headers": {
//             "Authorization": `${process.env.COMPANIES_HOUSE_API_KEY || officersFunctions.config().companies_house_api.key}`
//         }
//     };

//     officersRequest(headerOption, function (error: any, response: any, body: any) {
//         // console.log("Body:", body);
//         res.send(JSON.parse(body))
//     }
//     );
// })

// module.exports = officersFunctions.https.onRequest(officersServer)




export { };
const functions = require('firebase-functions');
const admin = require("firebase-admin");
const cors = require('cors');
const express = require('express');
const request = require('request');

const personsWithSignificantControlServer = express();

personsWithSignificantControlServer.use(cors());

personsWithSignificantControlServer.get('*/:companyId', function (req: any, res: any) {

    const { companyId } = req.params;

    return admin.firestore().collection('officers').doc(companyId).get()
        .then((doc: any) => {
            if (!doc.exists || (doc.exists && !doc.data()["companies-house"])) {
                const headerOption = {
                    "url": `https://api.companieshouse.gov.uk/company/${companyId}/officers`,
                    "headers": {
                        "Authorization": `${process.env.COMPANIES_HOUSE_API_KEY || functions.config().companies_house_api.key}`
                    }
                };

                request(headerOption, function (error: any, response: any, body: any) {
                    const now = new Date();
                    const items = JSON.parse(body).items;
                    if (items && items.map) {
                        const returnItems = items.map((item: any) => {
                            return {
                                countryOfResidence: item.country_of_residence ? item.country_of_residence : null,
                                dateOfBirth: item.date_of_birth ? `${item.date_of_birth.year}-${item.date_of_birth.month}` : null,
                                appointedOn: item.appointed_on ? item.appointed_on : null,
                                nationality: item.nationality ? item.nationality : null,
                                officerRole: item.officer_role ? item.officer_role : null,
                                identification: item.identification ? item.identification : null,
                                companyNumber: item.company_number ? item.company_number : null,
                                resignedOn: item.resigned_on ? item.resigned_on : null,
                                ceasedOn: item.ceased_on ? item.ceased_on : null,
                                occupation: item.occupation ? item.occupation : null,
                                name: item.name,
                                lastUpdate: now
                            }
                        })
                        admin.firestore().collection('officers').doc(companyId).set({ "companies-house": {items: returnItems }}).then(() => res.send({ items: returnItems }))
                    } else {
                        res.send(JSON.parse(body))
                    }
                });
            } else {
                res.send(doc.data()["companies-house"]);
            }
        })
        .catch((err: any) => {
            console.log('Error getting document', err);
        });
})

module.exports = functions.https.onRequest(personsWithSignificantControlServer)