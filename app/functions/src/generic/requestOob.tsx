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
        localId
    } = JSON.parse(req.body);

    const userRef = await userCollection.doc(localId);
    const userDoc = await userRef.get();
    const user = userDoc.data();
    const oob = Math.round((Math.random() * 1000000)) + 1;

    const CLICKSEND_EMAIL = process.env.CLICKSEND_EMAIL || functions.config().clicksend_email.key;
    const CLICKSEND_API_KEY = process.env.CLICKSEND_API_KEY || functions.config().clicksend_api.key;

    request.post({
        url: `https://rest.clicksend.com/v3/sms/send`,
        headers: {
            Authorization: `Basic ${Buffer.from(`${CLICKSEND_EMAIL}:${CLICKSEND_API_KEY}`).toString('base64')}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "messages": [
                {
                    "to": user.mobile,
                    "from": "Blink",
                    "source": "Blink",
                    "body": `Blink Verification Code (${oob}) - This code is valid for 10 minutes`
                }
            ]
        })
    }, async function (error: any, response: any, body: any) {
        if (error) {
            console.log("error", error);
        }

        console.log("body", body)

        if (JSON.parse(body).response_code === "SUCCESS") {

            await userRef.update({
                oob: {
                    code: oob,
                    expires: new Date().getTime() + 600000
                },
            }, { merge: true });

            res.send({ success: true });
        }
    })
});


module.exports = functions.https.onRequest(server);