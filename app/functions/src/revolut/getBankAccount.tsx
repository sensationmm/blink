
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
        accountId
    } = req.body;

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
                let updatedAccount = { ...account, updatedAt: (new Date().toString()), accounts: detailedAccount };
                // }));

                const updatedAccounts = accountData.accounts.map((account: any) => {
                        
                    if (account.id === accountId) {
                        
                        updatedAccount.accounts = updatedAccount.accounts.map((pot: any) => {
                            account.accounts.forEach((currentPot: any) => {
                                if (((pot.account_no === currentPot.account_no && pot.sort_code === currentPot.sort_code) || 
                                (pot.iban === currentPot.iban && pot.bic === currentPot.bic) ) && currentPot.connections ) {
                                    pot.connections = currentPot.connections;
                                }
                            });
                            return pot;
                        });
                        return updatedAccount;
                    }
                    return account;
                })

                res.send(updatedAccounts.find((account: any) => account.id === accountId));

                accountDoc.update({
                    ...accountData,
                    accounts: updatedAccounts
                }, { merge: true })
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