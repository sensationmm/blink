
export { }

const functions = require('firebase-functions');
const cors = require('cors');
const express = require('express');
const server = express();
const admin = require('firebase-admin');
const request = require('request');
const refIsGood = require('../generic/refIsGood');

const refreshToken = require('./refreshToken');

server.use(cors());
server.get('*/', async function (req: any, res: any) {

    const getAccountDetails = (access_token: string, accountId?: string) => {
        console.log("get accounts")
        request.get({
            headers: {
                Authorization: `Bearer ${access_token}`,
                "Content-Type": "application/json",
            },
            url: `https://b2b.revolut.com/api/1.0/accounts/${accountId}/bank-details`,
        }, async function (error: any, response: any, body: any) {
            // console.log("response", body.toJSON())
            if (error) {
                console.log("error", error);
            }

            // console.log(body);

            res.send(body);
        });
    }

    const { uId, accountId } = req.params;

    const userCollection = admin.firestore().collection('users');
    const userDoc = await userCollection.doc(uId).get();
    const user = userDoc.data();
    const profileDoc = await user.profile.get();
    const profile = await profileDoc.data();

    if (!profile.account) {
        return res.send("not found")
    }

    const accountDoc = await profile.account;
    const accountData = await (await accountDoc.get()).data();

    let { access_token,
        refresh_token,
        expires
    } = accountData.access;


    if (refIsGood(req.headers.referer)) {
        if (new Date() > expires) {
            console.log("refresh the token")
            const access_token = await refreshToken(refresh_token, uId);
            // return res.send("refreshToken")
            console.log("access_token", access_token)
            if (access_token) {
                getAccountDetails(access_token, accountId);
            }
        } else {
            console.log("not expired", access_token, accountId)
            getAccountDetails(access_token, accountId);
        }
    } else {
        res.status(401).send("naughty naughty");
    }

});


module.exports = functions.https.onRequest(server)