
const companyCors = require('cors');
const companyEXpress = require('express');
const request = require('request');

const companyServer = companyEXpress();

companyServer.use(companyCors());

companyServer.get('/company/:companyId/', function (req: any, res: any) {

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

module.exports = companyServer