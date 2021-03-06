
export { }

const functions = require('firebase-functions');
const cors = require('cors');
const express = require('express');
const server = express();
const admin = require("firebase-admin");
const request = require('request');

server.use(cors());

server.get('*/', async function (req: any, res: any) {

  const { state, code } = req.query;

  const XERO_CLIENT_ID = process.env.XERO_CLIENT_ID || functions.config().xero_client_id.key;
  const XERO_CLIENT_SECRET = process.env.XERO_CLIENT_SECRET || functions.config().xero_client_secret.key;
  const XERO_AUTHENTICATE_CALLBACK_URL = process.env.XERO_AUTHENTICATE_CALLBACK_URL || functions.config().xero_authenticate_callback_url.key;
  const XERO_AUTHENTICATE_REDIRECT_URL = process.env.XERO_AUTHENTICATE_REDIRECT_URL || functions.config().xero_authenticate_redirect_url.key;

  let auth = new Buffer(`${XERO_CLIENT_ID}:${XERO_CLIENT_SECRET}`);
  let base64auth = auth.toString('base64');

  request.post({
    headers: {
      authorization: `Basic ${base64auth}`,
      "Content-Type": "application/x-www-form-urlencoded"
    },
    url: 'https://identity.xero.com/connect/token',
    body: `grant_type=authorization_code&code=${code}&redirect_uri=${XERO_AUTHENTICATE_CALLBACK_URL}`
  }, async function (error: any, response: any, body: any) {
    console.log("response", response.toJSON())
    if (error) {
      console.log("error", error);
    }
    const t = new Date();
    
    const { id_token, access_token, expires_in, refresh_token } = JSON.parse(body);

    const xero = {
      id_token,
      access_token,
      expires: t.setSeconds(t.getSeconds() + parseInt(expires_in)),
      refresh_token,
      addedAt: new Date()
    }

    const userCollection = admin.firestore().collection('users');
    const userDoc = await(await userCollection.doc(state).get());
    const user = await userDoc.data()
    const profileDoc = user.profile;

    await profileDoc.update({
      xero: xero
    }, {merge: true});

    res.redirect(XERO_AUTHENTICATE_REDIRECT_URL)
  });
});

module.exports = functions.https.onRequest(server)