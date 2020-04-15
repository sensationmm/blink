export { }
const functions = require('firebase-functions');
const admin = require("firebase-admin");
const cors = require('cors');
const express = require('express');
const request = require('request');
const server = express();

server.use(cors());

const userCollection = admin.firestore().collection('users');

const CLICKSEND_EMAIL = process.env.CLICKSEND_EMAIL || functions.config().clicksend_email.key;
const CLICKSEND_API_KEY = process.env.CLICKSEND_API_KEY || functions.config().clicksend_api.key;
const BLINK_WEB_ADDRESS = process.env.BLINK_WEB_ADDRESS || functions.config().blink_web_address.key;

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

        const password = randomPassword();

        const payload = {
            email: user,
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
                // console.log("parsedBody", parsedBody)

                if (parsedBody.error) {
                    // console.log("error", parsedBody.error)

                    errors.push({
                        [user]: parsedBody.error.message
                    })
                    next();
                } else {
                    if (parsedBody.localId) {
                        // add the profile in users collection
                        await userCollection.doc(parsedBody.localId).set({
                            verified: false,
                            generatedBy: generatedBy || "z73PTfu2PmeUQFSNS5JiNVaHOXO2",
                            role: "",
                            personRef: ""
                        });

                        successfullyCreatedUsers.push({
                            email: user,
                            password
                        });
                        next();
                    } else {
                        errors.push({
                            [user]: "Unknown Error"
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
        // send emails
        await Promise.all(successfullyCreatedUsers.map((user: any) => {
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
                    "body": `<p>You have been invited to join Blink bank</p><p>Your username and password are ${user.email} / ${user.password} </p><p>Click <a href='${BLINK_WEB_ADDRESS}'>here</a></p>`
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