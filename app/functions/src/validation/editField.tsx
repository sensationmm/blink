export { }

const functions = require('firebase-functions');
const admin = require("firebase-admin");
const cors = require('cors');
const express = require('express');
const server = express();
server.use(cors());
server.post('*/', function (req: any, res: any) {
    const { docId, field, value } = req.body;

    const newDocID = docId.replace('companies/', '');

    admin.firestore().collection('companies')
        .doc(newDocID)
        .set({ [field]: value }, { merge: true })
        .then(function (res: any) {
            console.log("Rule edited with ID: ", newDocID);
        })
        .catch(function (error: string) {
            console.error("Error editing rule: ", error);
        });

    return res.send({ msg: `Edited ${field}:${value}` });
});
module.exports = functions.https.onRequest(server);
