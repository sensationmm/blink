
export { }

const functions = require('firebase-functions');
const cors = require('cors');
const express = require('express');
const server = express();
const admin = require('firebase-admin');
const request = require('request');
const refIsGood = require('./refIsGood');
const refreshToken = require('./refreshToken');

server.use(cors());
server.post('*/', async function (req: any, res: any) {

    const getCounterparties = (access_token: string) => {
        console.log("get counterparties")
        request.get({
            headers: {
                Authorization: `Bearer ${access_token}`,
                "Content-Type": "application/json",
            },
            url: 'https://b2b.revolut.com/api/1.0/counterparties',
        }, async function (error: any, response: any, body: any) {
            // console.log("response", body.toJSON())
            if (error) {
                console.log("error", error);
            }

            // console.log(body);

            res.send(body);
        });
    }

    const { uId } = req.body;

    const userCollection = admin.firestore().collection('users');
    const userDoc = await userCollection.doc(uId).get();
    const user = userDoc.data();

    if (!user.revolut) {
        return res.send("not found")
    }

    const revolutDoc = await user.revolut.get();
    const revolutData = revolutDoc.data();

    let { access_token,
        refresh_token, expires } = revolutData.access;

    const ref = req.headers.referer;
    console.log("ref", ref);

    if (refIsGood(req.headers.referer)) {
        if (new Date() > expires) {
            console.log("refresh the token")
            const access_token = await refreshToken(refresh_token, uId);
            // return res.send("refreshToken")
            console.log("access_token", access_token)
            if (access_token) {
                getCounterparties(access_token);
            }
        } else {
            console.log("not expires", access_token)
            getCounterparties(access_token);
        }
    } else {
        res.status(401).send("naughty naughty");
    }

});


module.exports = functions.https.onRequest(server)