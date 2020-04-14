export { }
const functions = require('firebase-functions');
const admin = require("firebase-admin");
const cors = require('cors');
const express = require('express');
const server = express();

server.use(cors());

const userCollection = admin.firestore().collection('users');

server.post('*/', async function (req: any, res: any) {
    const {
        localId,
        oob
    } = JSON.parse(req.body);

    const userRef = await userCollection.doc(localId);
    const userDoc = await userRef.get();
    const user = userDoc.data();
    
    if (user.oob && user.oob.code && user.oob.code == oob) {

        if (user.oob && user.oob.expires && new Date() > user.oob.expires) {
            res.send({ expired: true })
        }

        delete user.oob;

        await userRef.set({...user, 
            verified: true
        })
        res.send({ verified: true })
    } else {
        res.send({ verified: false })
    }
});


module.exports = functions.https.onRequest(server);