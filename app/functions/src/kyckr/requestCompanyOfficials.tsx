const kyckrCompanyOfficialsFunctions = require('firebase-functions');
const kyckrCompanyOfficialsCors = require('cors');
const kyckrCompanyOfficialsExpress = require('express');
var soap = require('soap');

const kyckrCompanyOfficialsServer = kyckrCompanyOfficialsExpress();

kyckrCompanyOfficialsServer.use(kyckrCompanyOfficialsCors());

kyckrCompanyOfficialsServer.get('*/:companyCode/:countryISOCode/:orderReference', function (req: any, res: any) {

    const { companyCode, countryISOCode, orderReference } = req.params;

    const url = 'https://testws.kyckr.eu/GBRDServices.asmx?wsdl';
    var args = { email: "terry.cordeiro@11fs.com", password: "6c72fde3", countryISOCode, companyCode, orderReference, termsAndConditions: true };

    console.log(JSON.stringify(req.params))
    const auth = "Basic " + JSON.stringify({"terry.cordeiro@11fs.com":"6c72fde3"})

    soap.createClient(url, { wsdl_headers: { Authorization: auth } }, function (err: any, client: any) {
        // console.log("error", err)
        // console.log("client", client)
        console.log("order reference:  ", orderReference);
        client.CompanyOfficials(args, function (err: any, result: any) {

            // console.log(result);
            if (err) {
                // console.log(err)
            }

            res.send(result);
        });
    });
})

module.exports = kyckrCompanyOfficialsFunctions.https.onRequest(kyckrCompanyOfficialsServer)