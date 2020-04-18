
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

    const getAccounts = (tenantId: string, res: any) => {
        request.get({
            headers: {
                authorization: `Bearer ${access_token}`,
                "Content-Type": "application/json",
                "Xero-tenant-id": tenantId
            },
            url: 'https://api.xero.com/api.xro/2.0/Accounts',
        }, async function (error: any, response: any, body: any) {
            // console.log("response", body.toJSON())
            if (error) {
                console.log("error", error);
            }

            // console.log(body);

            res.send(body);
        });
    }

    const getTenantIdAndThenGetAccounts = (access_token: string) => {
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
            console.log("tenantId", tenantId);
            console.log(" --------------------- ");
            console.log("access_token", access_token);
            if (tenantId) {
                getAccounts(tenantId, res);
            } else {

                const new_access_token = await refreshToken(refresh_token, uId);
                console.log("getTenantIdAndThenGetAccounts new_access_token", new_access_token);
                getTenantIdAndThenGetAccounts(new_access_token)
            }
        });
    }

    const { uId } = req.params;
    const userCollection = admin.firestore().collection('users');
    const userDoc = await (await userCollection.doc(uId).get());
    const user = await userDoc.data()
    const profile = await (await user.profile.get()).data();

    if (!profile.xero) {
        return res.send("not found")
    }

    let { access_token,
        refresh_token } = profile.xero;

    const ref = req.headers.referer;
    console.log("ref", ref);

    getTenantIdAndThenGetAccounts(access_token)
});


module.exports = functions.https.onRequest(server)