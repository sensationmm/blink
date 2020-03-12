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


    const valueToObject = (value: any, source: string = "registry") => {
        return {
            value,
            updatedAt: new Date(),
            source,
            certification: "",
            document: ""
        }
    }

    const newCompanyStructure: any = {};

    Object.keys(companyStructure).forEach(key => {
        newCompanyStructure[key] = valueToObject(companyStructure[key]);
    });

    if (ignoreDB) {
        // find and update
        const companyQuery = companyRef.where('searchName.value', '==', newCompanyStructure.searchName.value);
        companyQuery.get().then(async (companies: any) => {
            if (companies.empty) {
                companyRef.add({ ...newCompanyStructure }, { merge: true }).then((doc: any) => res.send(doc.ref));;
            } else {
                const companyDoc = companies.docs[0];
                companyDoc.ref.update({ ...newCompanyStructure }, { merge: true }).then((doc: any) => res.send(doc.ref));;
            }
        });
    } else {
        companyRef.add({ ...newCompanyStructure }).then((doc: any) => res.send(doc.ref));
    }

})

module.exports = functions.https.onRequest(server)