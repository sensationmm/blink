export { };
const functions = require('firebase-functions');
const admin = require("firebase-admin");
const cors = require('cors');
const express = require('express');
var soap = require('soap');

const server = express();

server.use(cors());

server.get('*/:companyCode/:countryISOCode', function (req: any, res: any) {

    const { companyCode, countryISOCode } = req.params;

    console.log("companyCode", companyCode);
    const officersRef = admin.firestore().collection('officers');
    const shareHoldersRef = admin.firestore().collection('shareholders');

    return shareHoldersRef.doc(companyCode).get().then((doc: any) => {
        if (!doc.exists || (doc.exists && !doc.data()["kyckr"])) {
            return officersRef.doc(companyCode).get().then((doc: any) => {
                if (!doc.exists || (doc.exists && !doc.data()["kyckr"])) {
                    // const url = 'https://testws.kyckr.eu/gbronboarding.asmx?wsdl';
                    const url = 'https://testws.kyckr.eu/GBRDServices.asmx?wsdl';
                    var args = { email: "terry.cordeiro@11fs.com", password: "6c72fde3", countryISOCode, companyCode, termsAndConditions: true };

                    const auth = "Basic " + JSON.stringify({ "terry.cordeiro@11fs.com": "6c72fde3" })

                    soap.createClient(url, { wsdl_headers: { Authorization: auth } }, function (err: any, client: any) {
                        // console.log("error", err)
                        // console.log("client", client)

                        client.CompanyProfile(args, function (err: any, result: any) {

                            console.log("requesting company profile", companyCode);
                            // console.log("profile result", result);
                            if (err) {
                                console.log("profile error", err);
                                // console.log(err)
                            }
                            console.log("result", result)

                            const returnItems = {
                                shareHolders: null,
                                officers: null
                            };

                            if (
                                result.CompanyProfileResult &&
                                result.CompanyProfileResult.CompanyProfile &&
                                result.CompanyProfileResult.CompanyProfile.directorAndShareDetails &&
                                result.CompanyProfileResult.CompanyProfile.directorAndShareDetails.shareHolders &&
                                result.CompanyProfileResult.CompanyProfile.directorAndShareDetails.shareHolders.ShareholderDetails) {


                                const returnShareHolderItems = result.CompanyProfileResult.CompanyProfile.directorAndShareDetails.shareHolders.ShareholderDetails.map((shareholder: any) => {

                                    return shareholder;
                                })

                                if (returnShareHolderItems && returnShareHolderItems.length > 0) {
                                    returnItems.shareHolders = returnShareHolderItems
                                } else {
                                    delete returnItems.shareHolders;
                                }

                            }

                            if (
                                result.CompanyProfileResult &&
                                result.CompanyProfileResult.CompanyProfile &&
                                result.CompanyProfileResult.CompanyProfile.directorAndShareDetails &&
                                result.CompanyProfileResult.CompanyProfile.directorAndShareDetails.directors &&
                                result.CompanyProfileResult.CompanyProfile.directorAndShareDetails.directors.Director) {


                                const returnDirectorsItems = result.CompanyProfileResult.CompanyProfile.directorAndShareDetails.directors.Director.map((director: any) => {
                                    return director;
                                })

                                if (returnDirectorsItems && returnDirectorsItems.length > 0) {
                                    returnItems.officers = returnDirectorsItems
                                } else {
                                    delete returnItems.officers;
                                }

                            }

                            admin.firestore().collection('shareholders').doc(companyCode).set({ "kyckr": { items: returnItems.shareHolders } }).then(

                                admin.firestore().collection('officers').doc(companyCode).set({ "kyckr": { items: returnItems.officers } }).then(

                                    () => res.send({ shareHolders: { items: returnItems.shareHolders }, officers: { items: returnItems.shareHolders } })
                                ));

                        });
                    });
                } else {
                    // return what we have

                    const returnItems = {
                        shareHolders: null,
                        officers: null
                    }
                    const returnOfficers = officersRef.doc(companyCode).get().data()["kyckr"];
                    const returnShareholders = shareHoldersRef.doc(companyCode).get().data()["kyckr"];

                    if (!returnOfficers) {
                        delete returnItems.officers
                    }
                    if (!returnShareholders) {
                        delete returnItems.shareHolders
                    }

                    console.log("returnItems", returnItems);
                    res.send(returnItems)
                }
            })
        } else {
            console.log("we have data")
            // return what we have

            const returnItems = {
                shareHolders: null,
                officers: null
            }

            const returnShareholders = doc.data()["kyckr"];

            if (!returnShareholders) {
                delete returnItems.shareHolders
            } else {
                returnItems.shareHolders = returnShareholders
            }

            admin.firestore().collection('officers').doc(companyCode).get().then((officersDoc: any) => {

                const returnOfficers = officersDoc.data()["kyckr"];

                if (!returnOfficers) {
                    delete returnItems.officers
                } else {
                    returnItems.officers = returnOfficers
                }

                res.send(returnItems);

            });

        }
    })

})

module.exports = functions.https.onRequest(server)