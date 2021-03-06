export { }

const functions = require('firebase-functions');
const admin = require("firebase-admin");
const cors = require('cors');
const express = require('express');
const server = express();
server.use(cors());
server.post('*/', function (req: any, res: any) {
    const { collection } = req.body;

    console.log('Deleting all rules...')
    const rules = admin.firestore().collection(collection);

    rules.get().then((list: any) => {
        list.forEach((doc: any) => {
            rules.doc(doc.id).delete().then(() => {
                console.log(`Deleted rule: ${doc.id}`);
            }).catch(function (error: any) {
                console.error("Error removing document: ", error);
            });
        });
    });

    return res.send({ msg: 'All rules deleted' });
});
module.exports = functions.https.onRequest(server);
