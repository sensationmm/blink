const kyckrCompanyProfileFunctions = require('firebase-functions');
const kyckrCompanyProfileCors = require('cors');
const kyckrCompanyProfileExpress = require('express');
var soap = require('soap');

const kyckrCompanyProfileServer = kyckrCompanyProfileExpress();

kyckrCompanyProfileServer.use(kyckrCompanyProfileCors());

kyckrCompanyProfileServer.get('*/:companyCode/:countryISOCode', function (req: any, res: any) {

    const { companyCode, countryISOCode } = req.params;

    console.log("companyCode", companyCode);

    // const url = 'https://testws.kyckr.eu/gbronboarding.asmx?wsdl';
    const url = 'https://testws.kyckr.eu/GBRDServices.asmx?wsdl';
    var args = { email: "terry.cordeiro@11fs.com", password: "6c72fde3", countryISOCode, companyCode, termsAndConditions: true };

    const auth = "Basic " + JSON.stringify({"terry.cordeiro@11fs.com":"6c72fde3"})

    soap.createClient(url, { wsdl_headers: { Authorization: auth } }, function (err: any, client: any) {
        // console.log("error", err)
        // console.log("client", client)
        client.CompanyProfile(args, function (err: any, result: any) {


            console.log(result);
            if (err) {
                console.log(err)
            }

            res.send(result);
        });
    });
})

module.exports = kyckrCompanyProfileFunctions.https.onRequest(kyckrCompanyProfileServer)