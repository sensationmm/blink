const functions = require('firebase-functions');
const companyCors = require('cors');
const companyExpress = require('express');
const request = require('request');

const companyServer = companyExpress();

companyServer.use(companyCors());

companyServer.get('*', function (req: any, res: any) {

    console.log("----- request company ------")

    console.log(req.param)

    console.log(process.env)

    const { companyId } = req.params;

    const headerOption = {
        "url": `https://api.companieshouse.gov.uk/company/${companyId}`,
        "headers": {
            "Authorization": `${process.env.APIKEY}`
        }
    };

    request(headerOption, function (error: any, response: any, body: any) {
        // console.log("Body:", body);
        res.send(JSON.parse(body))
    }
    );
})




module.exports = functions.https.onRequest(companyServer)