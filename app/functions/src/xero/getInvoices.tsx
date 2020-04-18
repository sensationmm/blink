
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
    
    const { uId } = req.params;
    
    const userCollection = admin.firestore().collection('users');
    const userDoc = await (await userCollection.doc(uId).get());
    const user = await userDoc.data()
    const profileDoc = user.profile;
    const profile = await (await profileDoc.get()).data()

    if (!profile.xero) {
        return res.send("not found")
    }
    let { access_token, expires, refresh_token } = profile.xero;

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

        if (tenantId) {

            request.get({
                headers: {
                    authorization: `Bearer ${access_token}`,
                    "Content-Type": "application/json",
                    "Xero-tenant-id": tenantId
                },
                url: 'https://api.xero.com/api.xro/2.0/Invoices',
                // url: 'https://api.xero.com/api.xro/2.0/Accounts'
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