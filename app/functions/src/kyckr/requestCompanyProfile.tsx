export { };
const functions = require('firebase-functions');
const admin = require("firebase-admin");
const cors = require('cors');
const express = require('express');
var soap = require('soap');
const server = express();
const dueDilCompanySearch = require('../duedill/searchCompany').searchCompany;

server.use(cors());

const buildShareholderPerson = (shareholder: any) => {
    const firstName = shareholder?.name?.split(' ').slice(0, -1).join(' ');
    const lastName = shareholder?.name?.split(' ').slice(-1).join(' ');

    let newShareholder: any = {};

    if (shareholder.name) {
        newShareholder.fullName = shareholder?.name?.toLowerCase()
    }
    if (firstName) {
        newShareholder.firstName = firstName;
    }
    if (lastName) {
        newShareholder.lastName = lastName;
    }
    if (shareholder?.dateOfBirth) {
        newShareholder.dateOfBirth = shareholder?.dateOfBirth;
    }
    return newShareholder;
}

// -------------------------------------
// -------------- START ----------------
// -------------------------------------

const db = admin.firestore();
let personsRef = db.collection('persons');
let shareholdingsRef = db.collection('shareholdings');
let companiesRef = db.collection('companies');

server.get('*/:companyCode/:countryISOCode/:orderReference/:registrationAuthority', async function (req: any, res: any) {

    const {
        companyCode,
        countryISOCode,
        orderReference,
        registrationAuthority
    } = req.params;

    const url = 'https://prodws.kyckr.co.uk/GBRDServices.asmx?wsdl';

    var args = { email: "terry.cordeiro@11fs.com", password: "6c72fde3", countryISOCode, companyCode, orderReference, registrationAuthority, termsAndConditions: true };

    const auth = "Basic " + JSON.stringify({ "terry.cordeiro@11fs.com": "6c72fde3" })
    const companyShareholdingsDocRef = shareholdingsRef.doc(companyCode)
    await companyShareholdingsDocRef
        .get().then(async (companyShareholdingsDoc: any) => {
            if (req.query.ignoreDB === "true" || !companyShareholdingsDoc.exists) {

                soap.createClient(url, { wsdl_headers: { Authorization: auth } }, function (err: any, client: any) {
                    client.CompanyProfile(args, async function (err: any, result: any) {

                        console.log("requesting company profile", companyCode);
                        if (err) {
                            console.log("profile error");
                        }

                        console.log("doesnt exist")

                        // console.log(JSON.stringify(result?.CompanyProfileResult?.CompanyProfile?.directorAndShareDetails))

                        if (result?.CompanyProfileResult?.CompanyProfile?.directorAndShareDetails?.shareHolders?.ShareholderDetails) {

                            const shareholderDetails = result?.CompanyProfileResult?.CompanyProfile?.directorAndShareDetails?.shareHolders?.ShareholderDetails;

                            const shareholders: any = await Promise.all(
                                shareholderDetails
                                    // what is shareholderType: 'O' ??
                                    .filter((sh: any) => sh.shareholderType === "P" || sh.shareholderType === "C")
                                    .map(async (sourceShareholder: any) => {

                                        const shareholder = {
                                            "percentage": sourceShareholder.percentage,
                                            "allInfo": sourceShareholder.allInfo,
                                            "currency": sourceShareholder.currency,
                                            "nominalValue": sourceShareholder.nominalValue,
                                            "shareCount": sourceShareholder.shareCount,
                                            "shareType": sourceShareholder.shareType,
                                            "shareholderType": sourceShareholder.shareholderType,
                                            "totalShareCount": sourceShareholder.totalShareCount,
                                            "totalShareValue": sourceShareholder.totalShareValue,
                                            "totalShares": sourceShareholder.totalShares
                                        };

                                        let docId: any;

                                        const name = sourceShareholder.name.toLowerCase();

                                        if (sourceShareholder.shareholderType === "P") {

                                            const newShareholder = await buildShareholderPerson(sourceShareholder);

                                            // its a person - see if we already have them in our DB and if not, add

                                            let personsQuery = personsRef.where('fullName', '==', name);
                                            await personsQuery.get().then(async (persons: any) => {

                                                if (persons.empty) {
                                                    const doc = await personsRef.add(newShareholder, { merge: true });
                                                    docId = doc.id;
                                                } else {
                                                    const personDoc = persons.docs[0];
                                                    docId = personDoc.id;
                                                    await personDoc.ref.update(newShareholder, { merge: true });
                                                }
                                            });
                                        }

                                        if (shareholder.shareholderType === "C") {

                                            let companiesQuery = companiesRef.where('name', '==', name);
                                            await companiesQuery.get().then(async (companies: any) => {

                                                const response = await dueDilCompanySearch(name, "gb,ie");
                                                const results = await JSON.parse(response)
                                                const company = results?.companies?.find((c: any) => c.name.toLowerCase() === name);

                                                const obj: any = {
                                                    name
                                                }

                                                if (company && company.companyId) {
                                                    obj.companyId = company.companyId;
                                                }

                                                // console.log("obj", obj)

                                                if (companies.empty) {
                                                    const doc = await companiesRef.add(obj, { merge: true });
                                                    docId = doc.id;
                                                } else {
                                                    const companiesDoc = companies.docs[0];
                                                    docId = companiesDoc.id;
                                                    await companiesDoc.ref.update(obj, { merge: true });
                                                }
                                            });
                                        }

                                        return { ...shareholder, docId }

                                    }));
                            console.log("shareholders", shareholders)
                            companyShareholdingsDocRef.set({ updateAt: new Date(), shareholders }).then(() => {

                                companyShareholdingsDocRef
                                    .get().then(async (companyShareholdingsDoc: any) => {
                                        console.log("companyShareholdingsDoc", companyShareholdingsDoc)
                                        const data = companyShareholdingsDoc.data();
                                        if (data) {
                                            const shareholders = await Promise.all(data?.shareholders?.map(async (shareholding: any) => {
                                                let shareholder: any = {};
                                                if (shareholding.shareholderType === "P") {
                                                    const personDoc = await personsRef.doc(shareholding.docId).get();
                                                    if (personDoc.exists) {
                                                        shareholder = personDoc.data();
                                                    }
                                                }
                                                if (shareholding.shareholderType === "C") {
                                                    const companyDoc = await companiesRef.doc(shareholding.docId).get();
                                                    if (companyDoc.exists) {
                                                        shareholder = companyDoc.data();
                                                    }
                                                }
                                                return { ...shareholding, ...shareholder }
                                            }));
                                            return res.send({ shareholders })
                                        } else {
                                            res.send("missing data")
                                        }
                                    });

                            })
                            // .then(() => res.send(shareholders));
                        }
                    })
                })
            } else {
                // await 


            }
        });


    console.log("finished");
    // return res.send("finished")
});

module.exports = functions.https.onRequest(server)