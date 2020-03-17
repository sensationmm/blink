export {} 
const functions = require('firebase-functions');
const cors = require('cors');
const express = require('express');
const request = require('request');
const server = express();

server.use(cors());

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
    }, function (error: any, response: any, body: any) {
        if (error) {
            console.log("error", error);
        }
        res.send(body);
    });
})

module.exports = functions.https.onRequest(server);