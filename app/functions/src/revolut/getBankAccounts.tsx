
export { }

const functions = require('firebase-functions');
const cors = require('cors');
const express = require('express');
const server = express();
const admin = require('firebase-admin');
const request = require('request');

const refreshToken = require('./refreshToken');

server.use(cors());
server.get('*/:uId', async function (req: any, res: any) {

    const getAccounts = (access_token: string) => {
        console.log("get accounts")
        request.get({
            headers: {
                Authorization: `Bearer ${access_token}`,
                "Content-Type": "application/json",
            },
            url: 'https://b2b.revolut.com/api/1.0/accounts',
        }, async function (error: any, response: any, body: any) {
            // console.log("response", body.toJSON())
            if (error) {
                console.log("error", error);
            }

            // console.log(body);

            res.send(body);
        });
    }

    const { uId } = req.params;

    const userCollection = admin.firestore().collection('users');
    const userDoc = await userCollection.doc(uId).get();
    const user = userDoc.data();

    if (!user.revolut) {
        return res.send("not found")
    }

    let { access_token,
        refresh_token, expires } = user.revolut;

    const ref = req.headers.referer;
    console.log("ref", ref);

    if (new Date() > expires) {
        console.log("refresh the token")
        const access_token = await refreshToken(refresh_token, uId);
        // return res.send("refreshToken")
        console.log("access_token", access_token)
        if (access_token) {
            getAccounts(access_token);
        }
    } else {
        console.log("not expires", access_token)
        getAccounts(access_token);
    }

});


module.exports = functions.https.onRequest(server)