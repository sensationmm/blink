

export { }

// const functions = require('firebase-functions');
const cors = require('cors');
const express = require('express');

const server = express();

server.use(cors());

server.get('*/', async function (req: any, res: any) {

    console.log("webhook", req);


    // const XERO_CLIENT_ID = process.env.XERO_CLIENT_ID || functions.config().xero_client_id.key;
    // const XERO_AUTHENTICATE_CALLBACK_URL = process.env.XERO_AUTHENTICATE_CALLBACK_URL || functions.config().xero_authenticate_callback_url.key;

    // try {
    //     const uId = req.query.uId;
    //     const scope = "openid%20profile%20email%20accounting.transactions%20accounting.settings%20offline_access";
    //     const consentUrl = `https://login.xero.com/identity/connect/authorize?response_type=code&client_id=${XERO_CLIENT_ID}&redirect_uri=${XERO_AUTHENTICATE_CALLBACK_URL}&scope=${scope}&state=${uId}`;
    //     res.send({ url: consentUrl });
    // } catch (err) {
    //     res.send("Sorry, something went wrong");
    // }
});

module.exports = functions.https.onRequest(server)