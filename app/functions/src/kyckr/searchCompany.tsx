const kyckrFunctions = require('firebase-functions');
const kyckrCors = require('cors');
const kyckrExpress = require('express');
var soap = require('soap');


const kyckrServer = kyckrExpress();

kyckrServer.use(kyckrCors());

kyckrServer.get('/', function (req: any, res: any) {

    const url = 'https://testws.kyckr.eu/gbronboarding.asmx?wsdl';
    var args = { "companyName": "eleven fs", "termsAndConditions": "true" };


    var auth = "Basic " + new Buffer("terry.cordeiro@11fs.com" + ":" + "6c72fde3").toString("base64");

    // soap.createClient(url, { wsdl_headers: {Authorization: auth} }, function(err, client) {
    // });

    soap.createClient(url, { wsdl_headers: { Authorization: auth } }, function (err: any, client: any) {
        // console.log("error", err)
        // console.log("client", client)
        client.CompanySearch(args, function (err: any, result: any) {
            console.log("client", client);
            res.send("here sd")
        });
    });
})

module.exports = kyckrFunctions.https.onRequest(kyckrServer)