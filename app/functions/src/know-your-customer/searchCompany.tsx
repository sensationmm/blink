export { }
const functions = require('firebase-functions');
const cors = require('cors');
const express = require('express');
const request = require('request');

const server = express();

server.use(cors());

const searchCompany = (query: any, countryCode: any) => {

    const body = {
        query,
        codeiso31662: countryCode,
    }

    return new Promise(resolve => {
        request.post({
            headers: { "ApiKey": `${process.env.KNOW_YOUR_CUSTOMER_API_KEY || functions.config().know_your_customer_api.key}` },
            url: 'https://api-demo.knowyourcustomer.com/v2/companies/search',
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