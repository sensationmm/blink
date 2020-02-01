
export { };

const functions = require('firebase-functions');
const cors = require('cors');
const express = require('express');
var soap = require('soap');

const server = express();

server.use(cors());

server.get('*/:companyCode/:registrationAuthority/:countryISOCode/:productId/:orderReference', function (req: any, res: any) {

    const { countryISOCode, orderReference, companyCode, registrationAuthority, productId } = req.params;

    console.log("req.params", req.params);

    const url = 'https://prodws.kyckr.co.uk/GBRDServices.asmx?wsdl';

    const args = { 
        email: "terry.cordeiro@11fs.com", 
        password: "6c72fde3", 
        countryISOCode, 
        companyCode, 
        registrationAuthority, 
        orderReference, 
        productId,
        termsAndConditions: true 
    };

    const auth = "Basic " + JSON.stringify({"terry.cordeiro@11fs.com":"6c72fde3"})

    soap.createClient(url, { wsdl_headers: { Authorization: auth } }, function (err: any, client: any) {
        // console.log("error", err)

        client.ProductOrder(args, function (err: any, result: any) {

            console.log((result));
            if (err) {
                console.log(err)
            }

            res.send(result);
        });
    });
})

module.exports = functions.https.onRequest(server)