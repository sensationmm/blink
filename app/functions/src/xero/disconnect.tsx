
export { }

const functions = require('firebase-functions');
const cors = require('cors');
const express = require('express');
const server = express();
const admin = require('firebase-admin');
const request = require('request');
const FieldValue = require('firebase-admin').firestore.FieldValue;

const refreshToken = require('./refreshToken');

server.use(cors());
server.get('*/:uId', async function (req: any, res: any) {

    const { uId } = req.params;

    const db = admin.firestore();

    const userCollection = db.collection('users');
    const userRef = await userCollection.doc(uId);
    const userDoc = await userRef.get();
    const user = await userDoc.data();

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

        const connection = JSON.parse(body)[0];

        console.log("connection", connection)
        console.log("access_token", access_token)

        if (connection?.tenantId) {

            request.delete({
                headers: {
                    authorization: `Bearer ${access_token}`,
                    "Content-Type": "application/json",
                    "Xero-tenant-id": connection.tenantId
                },
                url: `https://api.xero.com/connections/${connection.id}`,
            }, async function (error: any, response: any, body: any) {
                // console.log("response", body.toJSON())
                if (error) {
                    console.log("error", error);
                }
                await userRef.update({ ...user, xero: FieldValue.delete() });
                res.send({ success: true });
            });
        }

    });
});


module.exports = functions.https.onRequest(server)