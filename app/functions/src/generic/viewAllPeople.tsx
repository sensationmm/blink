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

    const documents = await db.collection("persons").get();

    for (const doc of documents.docs) {
        console.log(doc.id);
        let keys = Object.keys(doc.data());
        for(const key of keys) {
            if(doc.data()[key].hasOwnProperty('value') && key !== 'directorships') {
                console.log('  '+key+':', doc.data()[key].value);
            }
            else if(key !== 'directorships') {
                console.log('  '+key+':', doc.data()[key]);
            }
            
        }
    }
    
    res.send('Finished');
})

module.exports = functions.https.onRequest(server);
