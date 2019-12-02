const cors = require('cors');
const express = require('express');
const request = require('request');

const companyServer = express();

companyServer.use(cors());

companyServer.get('/company/:companyId/', function (req, res) {

    const { companyId } = req.params;

    const headerOption = {
        "url": `https://api.companieshouse.gov.uk/company/${companyId}`,
        "headers": {
            "Authorization": `${process.env.APIKEY}`
        }
    };

    request(headerOption, function (error, response, body) {
        // console.log("Body:", body);
        res.send(JSON.parse(body))
    }
    );
})

module.exports = companyServer