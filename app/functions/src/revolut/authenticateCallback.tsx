
export { }

const functions = require('firebase-functions');
const cors = require('cors');
const express = require('express');
const server = express();
// const admin = require("firebase-admin");
// const request = require('request');

server.use(cors());

server.get('*/', async function (req: any, res: any) {

    // placeholder
    
    console.log("Revolut Authenticate Callback");

    res.send("Revolut Authenticate Callback");
    
});

module.exports = functions.https.onRequest(server)