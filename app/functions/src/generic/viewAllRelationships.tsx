export { };

const functions = require('firebase-functions');
const admin = require("firebase-admin");

const cors = require('cors');
const express = require('express');

const server = express();
server.use(cors());

server.get('*/', async function (req: any, res: any) {
    /*const {
        collectionName
    } = req.params
    */

    const db = admin.firestore();

    const documents = await db.collection("relationships").get();

    for (const doc of documents.docs) {
        let keys = Object.keys(doc.data());
        for(const key of keys) {
            if (key === 'shareholderType') {
                console.log ('Relationship doc id: '+doc.id, 'Title: '+doc.data()[key]);
                console.log ('Source: '+doc.data().source.path);
                console.log ('Target: '+doc.data().target.path);
            }
        }
    }
    
    res.send('Finished');
})

module.exports = functions.https.onRequest(server);
