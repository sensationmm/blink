const kyckrFunctions = require('firebase-functions');
const kyckrCors = require('cors');
const kyckrExpress = require('express');
const ipRequest = require('request');
var soap = require('soap');

const kyckrServer = kyckrExpress();

kyckrServer.use(kyckrCors());

kyckrServer.get('*/:query/:countryISOCode/:orderReference', function (req: any, res: any) {

    const { query, countryISOCode, orderReference } = req.params;

    console.log("query", query);

    getKyckrSearchResults(query, countryISOCode, orderReference).then( (searchResults:any) => {
        //console.log('Results: ', searchResults);
        res.send(searchResults);
    });
})

function getKyckrSearchResults(query:any, countryISOCode:any, orderReference:any) {
    // const url = 'https://prodws.kyckr.co.uk/gbronboarding.asmx?wsdl';
    const url = 'https://prodws.kyckr.co.uk/GBRDServices.asmx?wsdl';

    var args = { email: "terry.cordeiro@11fs.com", password: "6c72fde3", countryISOCode, companyName: query, orderReference, termsAndConditions: true };


    // ipRequest({url: "http://httpbin.org/ip"}, function (error: any, response: any, body: any) {
    //     console.log("Body:", body);
    //     console.log("Response", response)
    // });


    const auth = "Basic " + JSON.stringify({"terry.cordeiro@11fs.com":"6c72fde3"})

    let p = new Promise(function(resolve, reject) {
        soap.createClient(url, { wsdl_headers: { Authorization: auth } }, function (err: any, client: any) {
            // console.log("error", err)
            // console.log("client", client)
            console.log("order reference: ", orderReference);

            client.CompanySearch(args, function (err: any, result: any) {
                console.log(result);
                if (err) {
                    console.log(err);
                    reject(err);
                }
                resolve(result);
            });
        });
    });
    return p
}

module.exports = kyckrFunctions.https.onRequest(kyckrServer)
module.exports.getKyckrSearchResults = getKyckrSearchResults;