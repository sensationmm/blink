export { }

const functions = require('firebase-functions');
const admin = require("firebase-admin");
const cors = require('cors');
const express = require('express');
const request = require('request');

const server = express();

server.use(cors());

server.get('*/:countryCode/:companyId', function (req: any, res: any) {

    const { companyId, countryCode, limit } = req.params;

    return admin.firestore().collection('shareholders').doc(companyId).get()
        .then((doc: any) => {
            if (req.query.ignoreDB === "true" || !doc.exists || (doc.exists && !doc.data()["duedill"])) {

                const options = {
                    "headers": {
                        "Accept": "application/json",
                        "X-AUTH-TOKEN": `${process.env.DUE_DILL_API_KEY || functions.config().due_dill_api.key}`
                    },
                    "url": `https://duedil.io/v4/company/${countryCode}/${companyId}/shareholders.json?limit=${limit || 50}`,
                    "credentials": 'include'
                };

                request(options, function (error: any, response: any, body: any) {
                    if (error) {
                        console.log("error", error);
                    }
                    const items = JSON.parse(body).shareholders;
                    if (items) {
                        return admin.firestore().collection('shareholders').doc(companyId).set({ "duedill": { items } }).then(() => res.send({ items }));
                    } 
                    // res.send({ items })
                })


            } else {
                console.log("found in firestore")
                res.send(doc.data()["duedill"]);
            }
        })
        .catch((err: any) => {
            console.log('Error getting document', err);
        });
})

module.exports = functions.https.onRequest(server)