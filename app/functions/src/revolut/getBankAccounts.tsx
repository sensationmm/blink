
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


    const getAccounts = (access_token: string) => {

        let needsRefresh = false;
        if (revolutData.accounts) {
            const now = new Date()
            revolutData.accounts.forEach((account: any) => {
                const diff = now.getTime() - new Date(account.updatedAt).getTime();
                console.log(diff);
                if (diff > 600000) { // 10 mins // 739969
                    needsRefresh = true
                }
            })
        } else {
            needsRefresh = true
        }


        console.log("get accounts - refreshing = ", needsRefresh)

        if (needsRefresh) {

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
                const accounts = JSON.parse(body);
                if (!accounts.message) { // message usually present if there is an error
                    let detailedAccounts: any = await Promise.all(accounts.map(async (account: any) => {
                        const response: any = await getAccountDetails(access_token, account.id);
                        const detailedAccounts = JSON.parse(response);
                        if (detailedAccounts.message) {
                            console.log(detailedAccounts.message)
                            return { ...account }
                        }
                        return { ...account, updatedAt: (new Date()).toString(), accounts: detailedAccounts };
                    }));

                    detailedAccounts = detailedAccounts.map((account: any) => {

                        account.accounts = account.accounts.map((pot: any) => {
                            revolutData ?.accounts ?.forEach((currentAccount: any) => {
                                if (currentAccount.id === account.id) {
                                    currentAccount.accounts ?.forEach((currentPot: any) => {
                                        if (((pot.account_no === currentPot.account_no && pot.sort_code === currentPot.sort_code) ||
                                            (pot.iban === currentPot.iban && pot.bic === currentPot.bic)) && currentPot.connections) {
                                            pot.connections = currentPot.connections;
                                        }
                                    });
                                }
                            });
                            return pot;
                        });

                        return account;
                    })

                    res.send(detailedAccounts);

                    user.revolut.update({
                        ...revolutData,
                        accounts: detailedAccounts
                    }, { merge: true })
                } else {
                    res.send(body);
                }
            });

        } else {
            res.send(revolutData.accounts);
        }
    }

    if (refIsGood(req.headers.referer)) {
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
    } else {
        res.status(401).send("naughty naughty");
    }

});


module.exports = functions.https.onRequest(server)