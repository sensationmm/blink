export { }

const functions = require('firebase-functions');
const admin = require("firebase-admin");
const cors = require('cors');
const express = require('express');
const server = express();
server.use(cors());
server.post('*/', function (req: any, res: any) {
    const { rule, collection } = req.body;

    admin.firestore().collection(collection)
        .add(rule)
        .then(function (docRef: any) {
            console.log("Rule written with ID: ", docRef.id);
        })
        .catch(function (error: string) {
            console.error("Error adding rule: ", error);
        });

    return res.send(rule);
});
module.exports = functions.https.onRequest(server);
