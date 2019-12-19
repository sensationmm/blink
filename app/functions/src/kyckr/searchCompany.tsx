const kyckrFunctions = require('firebase-functions');
const kyckrCors = require('cors');
const kyckrExpress = require('express');
var soap = require('soap');

const kyckrServer = kyckrExpress();

kyckrServer.use(kyckrCors());

kyckrServer.get('*/:query/:countryISOCode', function (req: any, res: any) {

    const { query, countryISOCode } = req.params;

    console.log("query", query);

    const url = 'https://testws.kyckr.eu/gbronboarding.asmx?wsdl';
    var args = { email: "terry.cordeiro@11fs.com", password: "c72fde3", countryISOCode, companyName: query, termsAndConditions: true };


    const auth = "Basic " + JSON.stringify({"terry.cordeiro@11fs.com":"c72fde3"})

    soap.createClient(url, { wsdl_headers: { Authorization: auth } }, function (err: any, client: any) {
        // console.log("error", err)
        // console.log("client", client)
        client.CompanySearch(args, function (err: any, result: any) {
            res.send(JSON.parse(result));
        });
    });
})

module.exports = kyckrFunctions.https.onRequest(kyckrServer)