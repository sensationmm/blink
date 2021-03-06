export { }
const functions = require('firebase-functions');
const cors = require('cors');
const express = require('express');
const request = require('request');

const server = express();

server.use(cors());

const searchCompany = (query: any, countryCodes: any) => {

    const body = {
        criteria: {
            name: query,
            countryCodes: { values: countryCodes.split(","), mode: "any" }
        }
    }


    return new Promise(resolve => {
        request.post({
            headers: { "X-AUTH-TOKEN": `${process.env.DUE_DILL_API_KEY || functions.config().due_dill_api.key}` },
            url: 'https://duedil.io/v4/search/companies.json?limit=50',
            body: JSON.stringify(body)
        }, function (error: any, response: any, body: any) {
            if (error) {
                console.log("error", error);
            }
            resolve(body)
        });
    })
}



server.get('*/:query/:countryCodes', async function (req: any, res: any) {

    const { query, countryCodes } = req.params;

    const body = await searchCompany(query, countryCodes);

    res.send(body)
})

module.exports = functions.https.onRequest(server);

module.exports.searchCompany = searchCompany;