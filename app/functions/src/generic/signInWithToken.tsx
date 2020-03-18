export {} 
const functions = require('firebase-functions');
const admin = require("firebase-admin");
const cors = require('cors');
const express = require('express');
const request = require('request');
const server = express();

server.use(cors());

const userCollection = admin.firestore().collection('users');

server.post('*/', async function (req: any, res: any) {
    const {
        token
    } = JSON.parse(req.body);

    const apiKey = process.env.FIREBASE_AUTH_API_KEY || functions.config().auth_api.key;
    const body = {
        idToken: token
    }

    request.post({
        url: `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${apiKey}`,
        body: JSON.stringify(body)
    }, async function (error: any, response: any, body: any) {
        if (error) {
            console.log("error", error);
        }
        let user = {};
        const parsedBody = JSON.parse(body);
        if (parsedBody.users && parsedBody.users[0] && parsedBody.users[0].localId) {
            const userDoc = await userCollection.doc(parsedBody.users[0]?.localId).get();
            if (userDoc) {
                user = await userDoc.data();
            }
            res.send({ ...user, ...parsedBody.users[0] });
        }
    });
})

module.exports = functions.https.onRequest(server);