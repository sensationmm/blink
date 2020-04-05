
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

    const {
        uId,
        accountId
    } = req.body;

    const userCollection = admin.firestore().collection('users');
    const userDoc = await userCollection.doc(uId).get();
    const user = userDoc.data();

    if (!user.revolut) {
        return res.send("not found")
    }

    const revolutDoc = await user.revolut.get();
    const revolutData = revolutDoc.data();

    let { access_token,
        refresh_token,
        expires
    } = revolutData.access;


    const getAccountDetails = (access_token: string, accountId: string) => {
        return new Promise(resolve => {
            console.log("get account details")
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
                resolve(body);
            });
        })
    }


    const getAccount = (access_token: string) => {
        console.log("get accounts")
        request.get({
            headers: {
                Authorization: `Bearer ${access_token}`,
                "Content-Type": "application/json",
            },
            url: `https://b2b.revolut.com/api/1.0/accounts/${accountId}`,
        }, async function (error: any, response: any, body: any) {
            // console.log("response", body.toJSON())
            if (error) {
                console.log("error", error);
            }
            const account = JSON.parse(body);
            if (!account.message) { // message usually present if there is an error
                // const detailedAccount = await Promise.all(accounts.map(async (account: any) => {
                const response: any = await getAccountDetails(access_token, account.id);
                const detailedAccount = JSON.parse(response);
                if (detailedAccount.message) {
                    console.log(detailedAccount.message)
                    return { ...account }
                }
                const updatedAccount = { ...account, updatedAt: (new Date().toString()), accounts: detailedAccount };
                // }));

                res.send(updatedAccount);

                user.revolut.update({
                    ...revolutData,
                    accounts: revolutData.accounts.map((account: any) => {
                        if (account.id === accountId) {
                            return updatedAccount
                        }
                        return account;
                    })
                })
            } else {
                res.send(body);
            }
        });
    }

    console.log("access_token", access_token)

    const ref = req.headers.referer;
    console.log("ref", ref);

    if (refIsGood(req.headers.referer)) {
        if (new Date() > expires) {
            console.log("refresh the token")
            const access_token = await refreshToken(refresh_token, uId);
            // return res.send("refreshToken")
            console.log("access_token", access_token)
            if (access_token) {
                getAccount(access_token);
            }
        } else {
            console.log("not expires", access_token)
            getAccount(access_token);
        }
    } else {
        res.status(401).send("naughty naughty");
    }

});


module.exports = functions.https.onRequest(server)