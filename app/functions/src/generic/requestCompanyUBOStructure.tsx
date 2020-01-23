export { };
const functions = require('firebase-functions');
const admin = require("firebase-admin");
const cors = require('cors');
const express = require('express');

const server = express();

server.use(cors());

server.get('*/:source/:companyId/:countryISOCode', function (req: any, res: any) {

    const { source, companyId, countryISOCode } = req.params;

    const companyDoc = admin.firestore().collection('companies').doc(companyId);

    companyDoc.get().then((doc: any) => {
        if (!doc.exists) {
            return res.status(404).send("not found");
        } else {
            const companyDocData = doc.data();

            if (companyDocData[countryISOCode] && companyDocData[countryISOCode][source]) {
                return res.send(companyDocData[countryISOCode][source])
            } else {
                return res.status(404).send("not found");
            }
        }
    })

})

module.exports = functions.https.onRequest(server)