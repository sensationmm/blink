export { }
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
        username,
        password,
    } = JSON.parse(req.body);

    const apiKey = process.env.FIREBASE_AUTH_API_KEY || functions.config().auth_api.key;

    const body = {
        email: username,
        password,
        returnSecureToken: true
    }

    request.post({
        url: `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`,
        body: JSON.stringify(body)
    }, async function (error: any, response: any, body: any) {
        if (error) {
            console.log("error", error);
        }
        let user: any = {};
        const parsedBody = JSON.parse(body);
        if (parsedBody.localId) {
            const userDoc = await userCollection.doc(parsedBody.localId).get();
            user = await userDoc.data();
        }

        if (user.xero) {
            const { expires } = user.xero
            user.xero = {
                expires
            };
        }
        if (user.revolut) {
            const revolutDoc = await user.revolut.get();
            const revolutData = revolutDoc.data();
            const { expires } = revolutData.access
            user.revolut = {
                expires
            };
        }

        res.send({ ...user, ...parsedBody });
    });
})

module.exports = functions.https.onRequest(server);