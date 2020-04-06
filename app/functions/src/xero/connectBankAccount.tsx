
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

    const { uId, name, accountId, account, code, 
        currency 
    } = req.body;

    const userCollection = admin.firestore().collection('users');
    const userDoc = await userCollection.doc(uId).get();
    // const accountsCollection = admin.firestore().collection('users');
    const user = userDoc.data();

    if (!user.xero || !user.revolut) {
        return res.send("not found")
    }
    let { access_token, expires, refresh_token } = user.xero;

    const t: any = new Date();

    if (t > expires) {
        access_token = await refreshToken(refresh_token, uId)
    }

    const revolutDoc = await user.revolut.get();
    const revolutData = revolutDoc.data();

    let { accounts
    } = revolutData;

    const accountToConnect = accounts.find((acc: any) => acc.id === accountId);

    if (!accountToConnect) {
        // user doesnt have permission to connect this account
        return res.status(403).send("naughty naughty");
    }

    request.get({
        headers: {
            authorization: `Bearer ${access_token}`,
            "Content-Type": "application/json"
        },
        url: 'https://api.xero.com/connections',
    }, async function (error: any, response: any, body: any) {
        // console.log("response", body.toJSON())
        if (error) {
            console.log("error", error);
        }

        const tenantId = JSON.parse(body)[0] ?.tenantId;

        console.log("tenantId", tenantId)

        if (tenantId) {

            const bankAccountNumber = (account.iban) ? `${account.iban}` : `${account.sort_code}-${account.account_no}`

            const accountBody = {
                Code: code.substring(0, 9),
                Name: name,
                Type: "BANK",
                BankAccountNumber: bankAccountNumber.substring(0, 19),
                BankAccountType: "BANK",
                CurrencyCode: currency
            }

            console.log("accountBody", accountBody)

            if (refIsGood(req.headers.referer)) {
                request.put({
                    headers: {
                        authorization: `Bearer ${access_token}`,
                        "Content-Type": "application/json",
                        "Xero-tenant-id": tenantId
                    },
                    body: JSON.stringify(accountBody),
                    url: 'https://api.xero.com/api.xro/2.0/Accounts',
                }, async function (error: any, response: any, body: any) {
                    // console.log("response", body.toJSON())
                    if (error) {
                        console.log("error", error);
                    }

                    console.log("======================")

                    console.log("body", body)

                    console.log("======================")


                    try {
                        const parsedBody = JSON.parse(body);
                        console.log(parsedBody)
                        if (parsedBody.Elements && parsedBody.Elements[0].ValidationErrors) {
                            return res.send({ message: parsedBody.Elements && parsedBody.Elements[0] ?.ValidationErrors[0].Message });
                        } else if (parsedBody.Message) {
                            return res.send({ message: parsedBody.Message });
                        } 
                        await user.revolut.update({
                            ...revolutData,
                            accounts: accounts.map((acc: any) => {
                                if (acc.id === accountId) {
                                    acc.accounts = acc.accounts.map((pot: any) => {
    
                                        if ((pot.sort_code === account.sort_code && pot.account_no === account.account_no) ||
                                            (pot.iban === account.iban && pot.bic === account.bic)) {
                                            pot.connections = {
                                                xero: parsedBody.Accounts[0].AccountID,
                                                dateTime: parsedBody.DateTimeUTC
                                            }
                                        }
                                        return pot;
                                    })
                                }
                                return acc
                            })
                        }, { merge: true })
    
    
                        // return res.send({ success: true });
    
                    } catch (e) {
                        return res.send({ message: body });
                    }

                   

                    console.log(body);

                    res.send(body);
                });
            } else {
                res.status(401).send("naughty naughty");
            }
        }

    });
});


module.exports = functions.https.onRequest(server)