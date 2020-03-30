
export { }

const functions = require('firebase-functions');
const cors = require('cors');
const express = require('express');
const server = express();
const admin = require("firebase-admin");
const request = require('request');
// const fs = require('fs')
const jwt = require('jsonwebtoken')


server.use(cors());

server.get('*/', async function (req: any, res: any) {

    const {
        // state, 
        code,
        uId
    } = req.query;

    const REVOLUT_PRIVATE_KEY = (`-----BEGIN RSA PRIVATE KEY-----\n${process.env.REVOLUT_PRIVATE_KEY || functions.config().revolut_private_key.key}\n-----END RSA PRIVATE KEY-----\n`).replace(/\\n/g, '\n');
    const REVOLUT_CLIENT_ID = process.env.REVOLUT_CLIENT_ID || functions.config().revolut_client_id.key;
    const REVOLUT_AUTHENTICATE_REDIRECT_URL = process.env.REVOLUT_PRIVATE_KEY || functions.config().revolut_authenticate_redirect_url.key;
    const REVOLUT_ISS = process.env.REVOLUT_ISS || functions.config().revolut_iss.key;

    // const privateKeyName = 'privatekey.pem' // Should be valid path to the private key
    // const issuer = REVOLUT_ISS // Issuer for JWT, should be derived from your redirect URL
    // const client_id = REVOLUT_CLIENT_ID // Your client ID
    const aud = 'https://revolut.com' // Constant
    const payload = {
        "iss": REVOLUT_ISS,
        "sub": REVOLUT_CLIENT_ID,
        "aud": aud
    }
    // const privateKey = fs.readFileSync(privateKeyName);
    const token = jwt.sign(payload, REVOLUT_PRIVATE_KEY, { algorithm: 'RS256', expiresIn: 60 * 60 });

    request.post({
        headers: {
            // authorization: `Basic ${base64auth}`,
            "Content-Type": "application/x-www-form-urlencoded"
        },
        url: 'https://b2b.revolut.com/api/1.0/auth/token',
        body: `grant_type=authorization_code&code=${code}&client_id=${REVOLUT_CLIENT_ID}&client_assertion_type=urn:ietf:params:oauth:client-assertion-type:jwt-bearer&client_assertion=${token}`
    }, async function (error: any, response: any, body: any) {
        console.log("response", response.toJSON())
        if (error) {
            console.log("error", error);
        }
        const t = new Date();

        const { token_type, access_token, expires_in, refresh_token } = JSON.parse(body);

        const revolut = {
            // id_token,
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