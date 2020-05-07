export { }
const functions = require('firebase-functions');
const admin = require("firebase-admin");
const cors = require('cors');
const express = require('express');
const request = require('request');
const server = express();

server.use(cors());

const userCollection = admin.firestore().collection('users');
const relationshipsCollection = admin.firestore().collection('relationships');

server.post('*/', async function (req: any, res: any) {
    const {
        username,
        password,
    } = JSON.parse(req.body);

    const apiKey = process.env.FIREBASE_AUTH_API_KEY || functions.config().auth_api.key;

    const body = {
        email: username,
        password,
        returnSecureToken: true
    }

    request.post({
        url: `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`,
        body: JSON.stringify(body)
    }, async function (error: any, response: any, body: any) {
        if (error) {
            console.log("error", error);
        }
        let user: any = {};
        let profileDocId: any;
        const parsedBody = JSON.parse(body);

        if (parsedBody.error) {
            return res.status(parsedBody.error.code).send({ error: { errors: [{ message: parsedBody.error.message }] } })
        }


        if (parsedBody.localId) {
            const userRef = await userCollection.doc(parsedBody.localId)
            const userDoc = await userRef.get();
            user = await userDoc.data();
            userRef.update({ ...user, refreshToken: parsedBody.refreshToken })
        }
        
        
        if (!user) {
            return res.status(403).send({ error: { errors: [{ message: "User profile not found "}] } })
        }

        if (user.admin) {

        } else {
            const profileObject = await user.profile.get();
            const profile = await (profileObject).data();
            profileDocId = profileObject.ref?.path;
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

                const relationships = await relationshipsCollection
                    .where('target', '==', profile.company)
                    .where('source', '==', user.person)
                    .where("type", "in", ["officer", "authorisedSigner"]).get()

                if (relationships.docs[0]) {
                    const relationship = await relationships.docs[0].data();
                    if (relationship.type) {
                        user.type = relationship.type;
                    }
                }
            }
            if (user.person) {
                const personObject = await user.person.get();
                const personData = await (personObject).data();

                const person: any = {};
                Object.keys(personData).forEach((key: any) => {
                    person[key] = personData[key].value
                })
                // const { expires } = accountData.access
                user = {
                    ...user,
                    ...person,
                    personDocId: personObject.ref?.path,
                    profileDocId,
                    markets: profile.markets,
                    structureConfirmed: profile.structureConfirmed,
                    onboardingCompleted: profile.onboardingCompleted,
                    gearboxEdited: profile.gearboxEdited
                };
            }
        }

        // delete user.xero;
        delete user.person;
        delete user.profile;
        delete user.generatedBy;
        delete parsedBody.providerUserInfo;
        delete parsedBody.refreshToken
        delete user.refreshToken

        res.send({ ...user, ...parsedBody });
    });
})

module.exports = functions.https.onRequest(server);