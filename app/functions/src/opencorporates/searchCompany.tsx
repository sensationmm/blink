export {};
const functions = require('firebase-functions');
const cors = require('cors');
const express = require('express');
const request = require('request');

const server = express();

server.use(cors());

server.get('*/:query', function (req: any, res: any) {

    const { query } = req.params;

    console.log("query", query);

    const headerOption = {
        "url": `https://api.opencorporates.com/v0.4/companies/search?q=${query.replace(/ /g, "+")}*&inactive=false&order=score`,
    };

    request(headerOption, function (error: any, response: any, body: any) {
        console.log("request body", body)
        // console.log("Body:", body);
        res.send(JSON.parse(body))
    }
    );
})

module.exports = functions.https.onRequest(server)