export { };
const functions = require('firebase-functions');
const admin = require("firebase-admin");
const cors = require('cors');
const express = require('express');
const request = require('request');

const server = express();

server.use(cors());

server.get('*/:companyId', function (req: any, res: any) {

    const { companyId } = req.params;

    return admin.firestore().collection('shareholders').doc(companyId).get()
        .then((doc: any) => {
            if (!doc.exists || (doc.exists && !doc.data()["companies-house"])) {
                const headerOption = {
                    "url": `https://api.companieshouse.gov.uk/company/${companyId}/persons-with-significant-control`,
                    "headers": {
                        "Authorization": `${process.env.COMPANIES_HOUSE_API_KEY || functions.config().companies_house_api.key}`
                    }
                };

                request(headerOption, function (error: any, response: any, body: any) {
                    const now = new Date();
                    const items = JSON.parse(body).items;
                    if (items && items.map) {
                        const returnItems =
                            items.map((item: any) => {
                                return {
                                    type: item.kind,
                                    countryOfResidence: item.country_of_residence ? item.country_of_residence : null,
                                    dateOfBirth: item.date_of_birth ? `${item.date_of_birth.year}-${item.date_of_birth.month}` : null,
                                    percentage: '',
                                    naturesOfControl: item.natures_of_control,
                                    notifiedOn: item.notified_on,
                                    companyNumber: item.company_number ? item.company_number : null,
                                    nationality: item.nationality ? item.nationality : null,
                                    identification: item.identification ? item.identification : null,
                                    resignedOn: item.resigned_on ? item.resigned_on : null,
                                    ceasedOn: item.ceased_on ? item.ceased_on : null,
                                    name: item.name,
                                    lastUpdate: now
                                }
                            })
                        admin.firestore().collection('shareholders').doc(companyId).set({ "companies-house": {items: returnItems }}).then(() => res.send({ items: returnItems }));
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

module.exports = functions.https.onRequest(server)