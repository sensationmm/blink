
export { }

const functions = require('firebase-functions');
const cors = require('cors');
const express = require('express');
const server = express();
const admin = require("firebase-admin");
const request = require('request');

server.use(cors());

const refreshToken = (refresh_token: string, uId: string) => {

  const REVOLUT_CLIENT_ID = process.env.REVOLUT_CLIENT_ID || functions.config().revolut_client_id.key;
  const REVOLUT_TOKEN = process.env.REVOLUT_TOKEN || functions.config().revolut_token.key;

  // console.log("refresh_token", refresh_token)
  // console.log("REVOLUT_CLIENT_ID", REVOLUT_CLIENT_ID)
  // console.log("REVOLUT_TOKEN", REVOLUT_TOKEN)
  return new Promise(resolve =>
    request.post({
      headers: {
        // authorization: `Basic ${base64auth}`,
        "Content-Type": "application/x-www-form-urlencoded"
      },
      url: 'https://b2b.revolut.com/api/1.0/auth/token',
      body: `grant_type=refresh_token&refresh_token=${refresh_token}&client_id=${REVOLUT_CLIENT_ID}&client_assertion_type=urn:ietf:params:oauth:client-assertion-type:jwt-bearer&client_assertion=${REVOLUT_TOKEN}`
    }, async function (error: any, response: any, body: any) {
      console.log("response", response.toJSON())
      if (error) {
        console.log("error", error);
      }
      const t = new Date();

      const { token_type, access_token, expires_in } = JSON.parse(body);

      const revolut = {
        // id_token,
        access_token,
        token_type,
        expires: t.setSeconds(t.getSeconds() + parseInt(expires_in)),
        // refresh_token,
        addedAt: new Date()
      }

      // console.log("revolut refresh- ", revolut)

      if (uId) {
        const userCollection = admin.firestore().collection('users');
        const userDoc = await userCollection.doc(uId);

        await userDoc.update({
          revolut: revolut
        }, { merge: true });
      }

      resolve(access_token);
    })
  );
};


module.exports = refreshToken;