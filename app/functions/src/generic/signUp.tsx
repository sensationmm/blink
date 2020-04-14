export { }
const functions = require('firebase-functions');
const admin = require("firebase-admin");
const cors = require('cors');
const express = require('express');
const request = require('request');
const server = express();

server.use(cors());

const userCollection = admin.firestore().collection('users');

function randomPassword() {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 15; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}

server.post('*/', async function (req: any, res: any) {
    const {
        email,
        generatedBy
    } = JSON.parse(req.body);

    const apiKey = process.env.FIREBASE_AUTH_API_KEY || functions.config().auth_api.key;
    const payload = {
        email,
        password: randomPassword(),
        returnSecureToken: true
    }

    console.log(payload)

    request.post({
        url: `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${apiKey}`,
        body: JSON.stringify(payload)
    }, async function (error: any, response: any, body: any) {
        if (error) {
            console.log("error", error);
        }
        // let user: any = {};
        const parsedBody = JSON.parse(body);

        if (parsedBody.error) {
            return res.send(parsedBody)
        } else {
            if (parsedBody.localId) {
                await userCollection.doc(parsedBody.localId).set({
                    verified: false,
                    generatedBy: generatedBy || "z73PTfu2PmeUQFSNS5JiNVaHOXO2",
                    role: "",
                    personRef: ""
                });
                return res.send({ result: "success" });
            }
        }
        console.log("parsedBody", parsedBody)

        res.status(404).send({ notFound: true });
    });

})

module.exports = functions.https.onRequest(server);