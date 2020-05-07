
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

    const deleteBankAccount = (tenantId: string, accountId: string, res: any) => {
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

            try {
                const parsedBody = JSON.parse(body);
                console.log(parsedBody)
                if (parsedBody.Elements && parsedBody.Elements[0].ValidationErrors) {
                    return res.send({ message: parsedBody.Elements && parsedBody.Elements[0] ?.ValidationErrors[0].Message });
                } else if (parsedBody.Message) {
                    return res.send({ message: parsedBody.Message });
                } else if (parsedBody.Status) {
                    if (parsedBody.Status === "OK") {
                        return res.send({ refresh: true, message: `Account ${parsedBody.Accounts[0].AccountID} deleted` });
                    }
                    return res.send({ message: parsedBody.Status });
                }
            } catch (e) {
                return res.send({ message: body });
            }
        });
    }

    const getTenantIdAndThenDeleteAccount = (access_token: string) => {
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
            if (tenantId) {
                deleteBankAccount(tenantId, accountId, res);
            } else {
                const new_access_token = await refreshToken(refresh_token, uId);
                console.log("new_access_token", new_access_token);
                getTenantIdAndThenDeleteAccount(new_access_token)
            }
        });
    }

    const { uId, accountId } = req.params;

    const userCollection = admin.firestore().collection('users');
    const userDoc = await (await userCollection.doc(uId).get());
    const user = await userDoc.data()
    const profileDoc = user.profile;
    const profile = await (await profileDoc.get()).data()

    if (!profile.xero || !profile.account) {
        return res.send("not found")
    }
    let { access_token, refresh_token } = profile.xero;


    const ref = req.headers.referer;
    console.log("ref", ref);

    getTenantIdAndThenDeleteAccount(access_token)
});


module.exports = functions.https.onRequest(server)