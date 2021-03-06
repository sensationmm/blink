
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
server.post('*/', async function (req: any, res: any) {

    const {
        uId,
        accountId,
        pendingPaymentAmount,
        currency,
        selectedCounterparty,
        requestId
    } = JSON.parse(req.body);

    const body = {
        "request_id": requestId,
        "account_id": accountId,
        "receiver": {
            ...selectedCounterparty
        },
        "amount": pendingPaymentAmount,
        "currency": currency,
        "reference": "Test payment"
    }

    console.log("body", JSON.stringify(body));

    const postPayment = (access_token: string) => {
        console.log("post payment")
        request.post({
            headers: {
                Authorization: `Bearer ${access_token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
            url: 'https://b2b.revolut.com/api/1.0/pay',
        }, async function (error: any, response: any, body: any) {
            // console.log("response", body.toJSON())
            if (error) {
                console.log("error", error);
            }
            res.send(body);
        });
    }

    const userCollection = admin.firestore().collection('users');
    const userDoc = await userCollection.doc(uId).get();
    const user = userDoc.data();
    const profileDoc = await user.profile.get();
    const profile = await profileDoc.data();

    if (!profile.account) {
        return res.send("not found")
    }

    const accountDoc = profile.account;
    const accountData = await (await accountDoc.get()).data();

    let { access_token,
        refresh_token, expires } = accountData.access;

    const ref = req.headers.referer;
    console.log("ref", ref);

    if (refIsGood(req.headers.referer)) {
        if (new Date() > expires) {
            console.log("refresh the token")
            const access_token = await refreshToken(refresh_token, uId);
            // return res.send("refreshToken")
            console.log("access_token", access_token)
            if (access_token) {
                postPayment(access_token);
            }
        } else {
            console.log("not expires", access_token)
            postPayment(access_token);
        }
    } else {
        res.status(401).send("naughty naughty");
    }

});


module.exports = functions.https.onRequest(server)