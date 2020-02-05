export { };
const functions = require('firebase-functions');
const admin = require("firebase-admin");
const cors = require('cors');
const express = require('express');

const server = express();

server.use(cors());

server.post('*/', function (req: any, res: any) {

    const {
        companyStructure
    } = JSON.parse(req.body);

    const companyRef = admin.firestore().collection('companies');

    companyRef.add({ ...companyStructure }).then((doc: any) => res.send(doc.ref));

})

module.exports = functions.https.onRequest(server)