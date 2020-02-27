export {} 
const functions = require('firebase-functions');
const cors = require('cors');
const express = require('express');
const server = express();

server.use(cors());

server.post('*/', async function (req: any, res: any) {
    const {
        password,
    } = JSON.parse(req.body);

    if (password === `${process.env.APP_PASSWORD || functions.config().app_password.key}`) {
        return res.status(200).send("ok")
    } else {
        return res.status(401).send("not ok")
    }
})

module.exports = functions.https.onRequest(server);