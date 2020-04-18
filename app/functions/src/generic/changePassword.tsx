export { }
const functions = require('firebase-functions');
const admin = require("firebase-admin");
const cors = require('cors');
const express = require('express');
const request = require('request');
const server = express();

server.use(cors());

const userCollection = admin.firestore().collection('users');
const FieldValue = require('firebase-admin').firestore.FieldValue;

server.post('*/', async function (req: any, res: any) {
    const {
        idToken,
        newPassword,
        localId
    } = JSON.parse(req.body);

    const apiKey = process.env.FIREBASE_AUTH_API_KEY || functions.config().auth_api.key;

    const refreshIdToken = async (resolve?: any) => {
        const userRef = await userCollection.doc(localId);
        const userDoc = await userRef.get();
        const user = await userDoc.data();
        const refreshToken = user.refreshToken;

        return request.post({
            url: `https://identitytoolkit.googleapis.com/v1/token?key=${apiKey}`,
            body: JSON.stringify({
                refresh_token: refreshToken,
                grant_type: "refresh_token"
            })
        }, async function (error: any, response: any, body: any) {
            const parsedRefreshTokenBody = JSON.parse(body);
            console.log("parsedRefreshTokenBody", parsedRefreshTokenBody)
        })
    };

    const changePassword = async (token?: string) => request.post({
        url: `https://identitytoolkit.googleapis.com/v1/accounts:update?key=${apiKey}`,
        body: JSON.stringify({
            idToken: token || idToken,
            password: newPassword,
            returnSecureToken: true
        })
    }, async function (error: any, response: any, body: any) {
        if (error) {
            console.log("error", error);

            return res.status(error.code).send({ error: error.message })
        }
        let user: any = {};
        const parsedBody = JSON.parse(body);
        console.log(parsedBody)

        if (parsedBody.error) {
            if (parsedBody.error ?.code === "INVALID_ID_TOKEN") {
                const newToken: string = await new Promise(refreshIdToken);
                changePassword(newToken);
            }
            return res.status(parsedBody.error.code).send({ error: parsedBody.error.message });
        }

        if (parsedBody.localId) {
            const userRef = await userCollection.doc(parsedBody.localId);
            const userDoc = await userRef.get();
            user = await userDoc.data();
            await userRef.update({ ...user, tempPassword: FieldValue.delete(), refreshToken: parsedBody.refreshToken });
        }

        const profile = await (await user.profile.get()).data();
        // const company = await(await user.company.get()).data();

        if (profile.xero) {
            const { expires } = profile.xero
            user.xero = {
                expires
            };
        }
        if (profile.account) {
            const accountData = await (await profile.account.get()).data();
            const { expires } = accountData.access
            user.account = {
                expires
            };
        }
        if (user.person) {
            const personData = await (await user.person.get()).data();
            const person: any = {};
            Object.keys(personData).forEach((key: any) => {
                person[key] = personData[key].value
            })
            // const { expires } = accountData.access
            user = { ...user, ...person };
        }

        // delete user.xero;
        delete user.person;
        delete user.profile;
        delete user.generatedBy;
        delete user.providerUserInfo;
        delete parsedBody.refreshToken

        res.send({ ...parsedBody, ...user, success: true })
    });

    changePassword()

})

module.exports = functions.https.onRequest(server);