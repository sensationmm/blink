
export { }

const functions = require('firebase-functions');
const cors = require('cors');
const express = require('express');
const server = express();
const admin = require('firebase-admin');
const request = require('request');

const refreshToken = require('./refreshToken');

server.use(cors());
server.get('*/:uId/:accountId', async function (req: any, res: any) {
    
    const { uId, accountId } = req.params;
    
    const userCollection = admin.firestore().collection('users');
    const userDoc = await userCollection.doc(uId).get();
    const user = userDoc.data();

    if (!user.xero) {
        return res.send("not found")
    }

    let { access_token, expires, refresh_token } = user.xero;

    const t: any = new Date();
    
    if (t > expires) {
        access_token = await refreshToken(refresh_token, uId)
    }

    const ref = req.headers.referer;
    console.log("ref", ref);

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

        const tenantId = JSON.parse(body)[0]?.tenantId;

        console.log("tenantId", tenantId)

        if (tenantId) {

            request.delete({
                headers: {
                    authorization: `Bearer ${access_token}`,
                    "Content-Type": "application/json",
                    "Xero-tenant-id": tenantId
                },
                url: `https://api.xero.com/api.xro/2.0/Accounts/${accountId}`,
            }, async function (error: any, response: any, body: any) {
                // console.log("response", body.toJSON())
                if (error) {
                    console.log("error", error);
                }

                console.log(body);

                res.send(body);
            });
        }

    });
});


module.exports = functions.https.onRequest(server)