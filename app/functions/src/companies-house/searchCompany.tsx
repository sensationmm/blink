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
        "url": `https://api.companieshouse.gov.uk/search/companies?q=${query}`,
        "headers": {
            "Authorization": `${process.env.COMPANIES_HOUSE_API_KEY || functions.config().companies_house_api.key}`
        }
    };

    request(headerOption, function (error: any, response: any, body: any) {
        // console.log("Body:", body);
        res.send(JSON.parse(body))
    }
    );
})

module.exports = functions.https.onRequest(server)