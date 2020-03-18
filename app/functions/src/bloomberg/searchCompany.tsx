export { }
const functions = require('firebase-functions');
const cors = require('cors');
const express = require('express');
const request = require('request');

const server = express();

server.use(cors());

const searchCompany = (query: string) => {

    return new Promise(resolve => {
        request.get({
            "url": `https://search.bloomberg.com/lookup.json?query=${query}&types=company_public%2CFund`
        }, function (error: any, response: any, body: any) {
            if (error) {
                console.log("error", error);
            }
            resolve(body)
        });
    })
}



server.get('*/:query', async function (req: any, res: any) {

    const { query } = req.params;
    const body: any = await searchCompany(query);
    res.send(body);
})

module.exports = functions.https.onRequest(server);

module.exports.searchCompany = searchCompany;