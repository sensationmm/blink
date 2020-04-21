export { }
const functions = require('firebase-functions');
const admin = require("firebase-admin");
const cors = require('cors');
const express = require('express');
const request = require('request');
const server = express();

server.use(cors());

const userCollection = admin.firestore().collection('users');
const relationshipsCollection = admin.firestore().collection('relationship');

const cryptrKey = process.env.CRYPTR_KEY || functions.config().cryptr.key;
const Cryptr = require('cryptr');
const cryptr = new Cryptr(cryptrKey);

server.post('*/', async function (req: any, res: any) {
    const {
        hashedToken,
    } = JSON.parse(req.body);

    let credentials;
    try {
        credentials = cryptr.decrypt(hashedToken).split(":");
    }
    catch (e) {
        res.send({ error: "Invalid token " });
    }

    const apiKey = process.env.FIREBASE_AUTH_API_KEY || functions.config().auth_api.key;

    const body = {
        email: credentials[0],
        password: credentials[1],
        returnSecureToken: true
    }

    console.log("body", body)

    request.post({
        url: `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`,
        body: JSON.stringify(body)
    }, async function (error: any, response: any, body: any) {
        if (error) {
            console.log("error", error);
        }
        let user: any = {};
        const parsedBody = JSON.parse(body);

        console.log("parsedBody", parsedBody);

        if (parsedBody.error) {
            res.status(parsedBody.error.code).send({ error: parsedBody.error.message })
        }

        if (parsedBody.localId) {
            const userRef = await userCollection.doc(parsedBody.localId)
            const userDoc = await userRef.get();
            user = await userDoc.data();
            userRef.update({ ...user, refreshToken: parsedBody.refreshToken })
        }

        if (user.admin) {
            // should never happen from an invite?
        } else {
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
                const companyData = await(await profile.company.get()).data();
                // const { expires } = accountData.access
                user.company = {
                    companyId: companyData?.companyId.value,
                    countryCode: companyData?.countryCode.value,
                    name: companyData?.name.value
                }
    
                const relationships = await relationshipsCollection
                .where('target', '==', profile.company)
                .where('source', '==', user.person).get();
    
                if (relationships.docs[0]) {
                    const relationship = await relationships.docs[0].data();
                    if (relationship.type) {
                        user.type = relationship.type;
                    }
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
        }

        // delete user.xero;
        delete user.person;
        delete user.profile;
        delete user.generatedBy;
        delete parsedBody.providerUserInfo;
        delete user.refreshToken

        delete parsedBody.refreshToken

        res.send({ ...user, ...parsedBody });
    });
})

module.exports = functions.https.onRequest(server);