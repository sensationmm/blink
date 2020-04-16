export { }
const functions = require('firebase-functions');
const admin = require("firebase-admin");
const cors = require('cors');
const express = require('express');
const request = require('request');
const server = express();

server.use(cors());

const userCollection = admin.firestore().collection('users');
const cryptrKey = process.env.CRYPTR_KEY || functions.config().cryptr.key;
const Cryptr = require('cryptr');
const cryptr = new Cryptr(cryptrKey);

server.post('*/', async function (req: any, res: any) {
    const {
        hashedToken,
    } = JSON.parse(req.body);

    let credentials;
    try {
        credentials = cryptr.decrypt(hashedToken).split(":");
    }
    catch (e) {
        res.send({ error: "Invalid token "});
    }

    const apiKey = process.env.FIREBASE_AUTH_API_KEY || functions.config().auth_api.key;

    const body = {
        email: credentials[0],
        password: credentials[1],
        returnSecureToken: true
    }

    console.log("body", body)

    request.post({
        url: `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`,
        body: JSON.stringify(body)
    }, async function (error: any, response: any, body: any) {
        if (error) {
            console.log("error", error);
        }
        let user: any = {};
        const parsedBody = JSON.parse(body);

        console.log("parsedBody", parsedBody);

        if (parsedBody.error) {
            res.status(parsedBody.error.code).send({ error: parsedBody.error.message })
        }

        if (parsedBody.localId) {
            const userRef = await userCollection.doc(parsedBody.localId)
            const userDoc = await userRef.get();
            user = await userDoc.data();
            userRef.update({ ...user, refreshToken: parsedBody.refreshToken })
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

        delete parsedBody.refreshToken
        delete user.refreshToken

        res.send({ ...user, ...parsedBody });
    });
})

module.exports = functions.https.onRequest(server);