export { }
const functions = require('firebase-functions');
const admin = require("firebase-admin");
const cors = require('cors');
const express = require('express');
const request = require('request');
const server = express();

server.use(cors());

const userCollection = admin.firestore().collection('users');

server.post('*/', async function (req: any, res: any) {
    const {
        token
    } = JSON.parse(req.body);

    const apiKey = process.env.FIREBASE_AUTH_API_KEY || functions.config().auth_api.key;
    const body = {
        idToken: token,
    }

    request.post({
        url: `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${apiKey}`,
        body: JSON.stringify(body)
    }, async function (error: any, response: any, body: any) {
        if (error) {
            console.log("error", error);
        }
        let user: any = {};
        const parsedBody = JSON.parse(body);
        if (parsedBody.users && parsedBody.users[0] && parsedBody.users[0].localId) {
            const userDoc = await userCollection.doc(parsedBody.users[0] ?.localId).get();
            if (userDoc) {
                user = await userDoc.data();
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

            if (profile.company) {
                const companyData = await (await profile.company.get()).data();
                // const { expires } = accountData.access
                user.company = {
                    companyId: companyData?.companyId.value,
                    countryCode: companyData?.countryCode.value,
                    name: companyData?.name.value
                }
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
            delete user.refreshToken;
            delete user.providerUserInfo;

            res.send({ ...user, ...parsedBody.users[0] });
        }
        else {
            res.status(404).send({ notFound: true });
        }
    });

})

module.exports = functions.https.onRequest(server);