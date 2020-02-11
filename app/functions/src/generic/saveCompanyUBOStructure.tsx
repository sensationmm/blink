export { };
const functions = require('firebase-functions');
const admin = require("firebase-admin");
const cors = require('cors');
const express = require('express');

const server = express();

server.use(cors());

server.post('*/', function (req: any, res: any) {

    const {
        companyStructure,
        ignoreDB
    } = JSON.parse(req.body);

    const companyRef = admin.firestore().collection('companies');

    if (ignoreDB) {
        // find and update
        const companyQuery = companyRef.where('searchName', '==', companyStructure.searchName);
        companyQuery.get().then(async (companies: any) => {
            if (companies.empty) {
                companyRef.add({ ...companyStructure }, { merge: true }).then((doc: any) => res.send(doc.ref));;
            } else {
                const companyDoc = companies.docs[0];
                companyDoc.ref.update({ ...companyStructure }, { merge: true }).then((doc: any) => res.send(doc.ref));;
            }
        });
    } else {
        companyRef.add({ ...companyStructure }).then((doc: any) => res.send(doc.ref));
    }

})

module.exports = functions.https.onRequest(server)