export { }
const functions = require('firebase-functions');
const admin = require("firebase-admin");
const cors = require('cors');
const express = require('express');
const request = require('request');
const server = express();

server.use(cors());

const userCollection = admin.firestore().collection('users');
// const personCollection = admin.firestore().collection('persons');
// const companiesCollection = admin.firestore().collection('companies');
const profilesCollection = admin.firestore().collection('profiles');
const relationshipsCollection = admin.firestore().collection('relationships');

const CLICKSEND_EMAIL = process.env.CLICKSEND_EMAIL || functions.config().clicksend_email.key;
const CLICKSEND_API_KEY = process.env.CLICKSEND_API_KEY || functions.config().clicksend_api.key;
const BLINK_WEB_ADDRESS = process.env.BLINK_WEB_ADDRESS || functions.config().blink_web_address.key;

const cryptrKey = process.env.CRYPTR_KEY || functions.config().cryptr.key;
const Cryptr = require('cryptr');
const cryptr = new Cryptr(cryptrKey);

function randomPassword() {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 15; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}

server.post('*/', async function (req: any, res: any) {
    const {
        users,
        generatedBy
    } = JSON.parse(req.body);

    const apiKey = process.env.FIREBASE_AUTH_API_KEY || functions.config().auth_api.key;
    const successfullyCreatedUsers: any = [];
    const errors: any = [];


    for (let i = 0; i < users.length; i++) {

        const user = users[i];

        // const personRef = personCollection.doc(user.personDocId);
        // const companyRef = companiesCollection.doc(user.companyDocId);

        const personRef = admin.firestore().doc(`/${user.personDocId}`);
        const companyRef = admin.firestore().doc(`/${user.companyDocId}`);
        const account = admin.firestore().doc('accounts/7desnAIVHZKPq9FzAdgn');

        // check if there is a profile connected to this company already

        const companyDoc = await companyRef.get();
        if (!companyDoc.exists) {
            return res.send({ error: { errors: [{ message: `Company document ${user.companyDocId} does not exist` }] } })
        }

        const personDoc = await personRef.get();
        if (!personDoc.exists) {
            return res.send({ error: { errors: [{ message: `Person document ${user.personDocId} does not exist` }] } })
        } else {
            // check that there isnt already a user account for this person
            const users = await userCollection.where('person', '==', personRef).get();
            if (users.docs[0]) {
                return res.send({ error: { errors: [{ message: `User account for person ${user.personDocId} already exists` }] } })
            }
        }

        // check there is a relationship between the person and the company
        const relationships = await relationshipsCollection
            .where('target', '==', companyRef)
            .where('source', '==', personRef).get();

        if (!relationships.docs[0]) {
            return res.send({ error: { errors: [{ message: `Person ${user.personDocId} doesn't have a relationship with company id ${user.companyDocId}` }] } })
        }

        const profiles = await profilesCollection.where('company', '==', companyRef).get();
        let profileRef: any;

        if (profiles.docs[0]) {
            profileRef = await profiles.docs[0].ref;
            console.log("profileRef", profileRef);
        }

        const password = randomPassword();

        const payload = {
            email: user.email,
            password,
            returnSecureToken: true
        }

        await new Promise(async (next) => {
            await request.post({
                url: `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${apiKey}`,
                body: JSON.stringify(payload)
            }, async function (error: any, response: any, body: any) {
                if (error) {
                    console.log("error", error);
                }
                const parsedBody = JSON.parse(body);

                if (parsedBody.error) {
                    errors.push({
                        [user.email]: parsedBody.error.message
                    })
                    next();
                } else {
                    if (parsedBody.localId) {
                        // add the profile in users collection

                        if (!profileRef) {
                            profileRef = await profilesCollection.add({
                                account,
                                company: companyRef
                            });
                            // profileRef = profile.ref;
                        }

                        await userCollection.doc(parsedBody.localId).set({
                            screened: false,
                            verified: false,
                            generatedBy: generatedBy || "z73PTfu2PmeUQFSNS5JiNVaHOXO2",
                            profile: profileRef,
                            mobile: user.mobile || "+447492667072",
                            person: personRef,
                            tempPassword: true
                        });

                        successfullyCreatedUsers.push({
                            email: user.email,
                            password
                        });
                        next();
                    } else {
                        errors.push({
                            [user.email]: "Unknown Error"
                        })
                        next();
                    }
                }
            });
        })
    }

    if (users.length === successfullyCreatedUsers.length) {
        console.log("all good")
    }

    if (successfullyCreatedUsers.length > 0) {
        // send email

        await Promise.all(successfullyCreatedUsers.map((user: any) => {

            const credentials = cryptr.encrypt(`${user.email}:${user.password}`);

            request.post({
                url: `https://rest.clicksend.com/v3/email/send`,
                headers: {
                    Authorization: `Basic ${Buffer.from(`${CLICKSEND_EMAIL}:${CLICKSEND_API_KEY}`).toString('base64')}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    "to": [{
                        email: user.email,
                        name: user.email
                    }],
                    "from": {
                        email_address_id: 9102, // info@blink-bank.com
                        name: "Blink",
                    },
                    subject: "You have been invited to join Blink bank",
                    "body": `<p>You have been invited to join Blink bank</p><p>Your username is ${user.email}</p><p>Click <a href='${BLINK_WEB_ADDRESS}?login=${credentials}'>here</a></p>`
                })
            }, async function (error: any, response: any, body: any) {
                if (error) {
                    console.log("error", error);
                }

                console.log("body", body)

                if (JSON.parse(body).response_code === "SUCCESS") {
                    console.log("email sent to ", user.email)
                }
            })
        }
        ));

        res.send({ success: true });
    } else {
        console.log("errors", errors)
        res.send({ message: "something went wrong" })
    }

})

module.exports = functions.https.onRequest(server);