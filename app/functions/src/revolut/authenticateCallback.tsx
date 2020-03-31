
export { }

const functions = require('firebase-functions');
const cors = require('cors');
const express = require('express');
const server = express();
const admin = require("firebase-admin");
const request = require('request');

server.use(cors());

server.get('*/', async function (req: any, res: any) {

    const {
        // state, 
        code,
        uId
    } = req.query;

    const REVOLUT_CLIENT_ID = process.env.REVOLUT_CLIENT_ID || functions.config().revolut_client_id.key;
    const REVOLUT_TOKEN = generateJWT();
    const REVOLUT_AUTHENTICATE_REDIRECT_URL = process.env.REVOLUT_PRIVATE_KEY || functions.config().revolut_authenticate_redirect_url.key;
    
    request.post({
        headers: {
            // authorization: `Basic ${base64auth}`,
            "Content-Type": "application/x-www-form-urlencoded"
        },
        url: 'https://b2b.revolut.com/api/1.0/auth/token',
        body: `grant_type=authorization_code&code=${code}&client_id=${REVOLUT_CLIENT_ID}&client_assertion_type=urn:ietf:params:oauth:client-assertion-type:jwt-bearer&client_assertion=${REVOLUT_TOKEN}`
    }, async function (error: any, response: any, body: any) {
        console.log("response", response.toJSON())
        if (error) {
            console.log("error", error);
        }
        const t = new Date();

        const { token_type, access_token, expires_in, refresh_token } = JSON.parse(body);

        const revolut = {
            // id_token,
            jwt: REVOLUT_TOKEN,
            access_token,
            token_type,
            expires: t.setSeconds(t.getSeconds() + parseInt(expires_in)),
            refresh_token,
            addedAt: new Date()
        }

        console.log("revolut - ", revolut)

        if (uId) {
            const userCollection = admin.firestore().collection('users');
            const userDoc = await userCollection.doc(uId);

            await userDoc.update({
                revolut: revolut
            }, { merge: true });
        }

        res.redirect(REVOLUT_AUTHENTICATE_REDIRECT_URL)
    });
});

module.exports = functions.https.onRequest(server)