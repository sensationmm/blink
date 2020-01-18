export { };
const functions = require('firebase-functions');
const admin = require("firebase-admin");
const cors = require('cors');
const express = require('express');

const server = express();

server.use(cors());

server.post('*/', function (req: any, res: any) {

    const {
        companyNumber,
        countryISOCode,
        companyStructure
    } = JSON.parse(req.body);


    console.log(companyNumber);
    console.log(countryISOCode);
    console.log(companyStructure);

    return admin.firestore().collection('companies').doc(companyNumber).set({ "kyckr": { ...companyStructure } }).then(() => res.send("ok"));
})

module.exports = functions.https.onRequest(server)