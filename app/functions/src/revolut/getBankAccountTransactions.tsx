
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

    const { uId } = req.body;

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

    const getTransactions = (access_token: string) => {
        console.log("get transactions")
        request.get({
            headers: {
                Authorization: `Bearer ${access_token}`,
                "Content-Type": "application/json",
            },
            url: 'https://b2b.revolut.com/api/1.0/transactions',
        }, async function (error: any, response: any, body: any) {
            // console.log("response", body.toJSON())
            if (error) {
                console.log("error", error);
            }
            const transactions = JSON.parse(body)
            if (!transactions.message) { // message usually present if there is an error
                accountDoc.update({
                    ...accountData,
                    transactions: {
                        items: transactions,
                        updatedAt: new Date()
                    }
                })
            } else {
                res.send(transactions)
            }

            res.send("transactions");
        });
    }

    let { access_token,
        refresh_token, expires } = accountData.access;

    if (refIsGood(req.headers.referer)) {
        if (new Date() > expires) {
            console.log("refresh the token")
            const access_token = await refreshToken(refresh_token, uId);
            // return res.send("refreshToken")
            console.log("access_token", access_token)
            if (access_token) {
                getTransactions(access_token);
            }
        } else {
            console.log("not expires", access_token)
            getTransactions(access_token);
        }
    } else {
        res.status(401).send("naughty naughty");
    }

});


module.exports = functions.https.onRequest(server)