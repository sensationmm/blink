export { };
const functions = require('firebase-functions');
const admin = require("firebase-admin");
const cors = require('cors');
const express = require('express');
var soap = require('soap');
const server = express();
const dueDilCompanySearch = require('../duedill/searchCompany').searchCompany;
const dueDilCompanyVitals = require('../duedill/requestCompanyVitals').requestCompanyVitals;

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
let officersRef = db.collection('officers');
let companiesRef = db.collection('companies');

server.get('*/:companyCode/:countryISOCode/:orderReference/:registrationAuthority', async function (req: any, res: any) {
    console.log("requestCompanyProfile")
    const {
        companyCode,
        countryISOCode,
        orderReference,
        registrationAuthority
    } = req.params;

    const response = await requestCompanyProfile(
        companyCode,
        countryISOCode,
        orderReference,
        registrationAuthority,
        req.query.ignoreDB
    )

    res.send(response);

});

const requestCompanyProfile = async (companyCode: any,
    countryISOCode: any,
    orderReference: any,
    registrationAuthority: any,
    ignoreDB: string) => {

    return new Promise(resolve => {

        const url = 'https://prodws.kyckr.co.uk/GBRDServices.asmx?wsdl';

        var args = { email: "terry.cordeiro@11fs.com", password: "6c72fde3", countryISOCode, companyCode, orderReference, registrationAuthority, termsAndConditions: true };

        const auth = "Basic " + JSON.stringify({ "terry.cordeiro@11fs.com": "6c72fde3" })
        const companyShareholdingsDocRef = shareholdingsRef.doc(companyCode)
        const companyOfficersDocRef = officersRef.doc(companyCode)

        const go = async () => {

            const companyShareholdingsDoc = await companyShareholdingsDocRef
                .get()

            const companyOfficersDoc = await companyOfficersDocRef
                .get()

            if (ignoreDB === "true" || !companyShareholdingsDoc.exists || !companyOfficersDoc.exists) {

                soap.createClient(url, { wsdl_headers: { Authorization: auth } }, function (err: any, client: any) {
                    client.CompanyProfile(args, async function (err: any, result: any) {

                        console.log("requesting company profile", companyCode);
                        if (err) {
                            // console.log("profile error");
                        }

                        // console.log("doesnt exist")

                        // console.log(JSON.stringify(result?.CompanyProfileResult?.CompanyProfile?.directorAndShareDetails))

                        const directorAndShareDetails = result?.CompanyProfileResult?.CompanyProfile?.directorAndShareDetails;

                        if (directorAndShareDetails) {

                            console.log("directorAndShareDetails", directorAndShareDetails)

                            const shareholderDetails =
                                directorAndShareDetails?.shareHolders?.ShareholderDetails;

                            const shareholders: any = await Promise.all(
                                shareholderDetails
                                    // what is shareholderType: 'O' ??
                                    // .filter((sh: any) => sh.shareholderType === "P" || sh.shareholderType === "C")
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

                                        const searchName = sourceShareholder?.name?.toLowerCase();
                                        const name = sourceShareholder?.name;

                                        if (sourceShareholder.shareholderType === "P") {

                                            const newShareholder = await buildShareholderPerson(sourceShareholder);

                                            // it's a person - see if we already have them in our DB and if not, add

                                            let personsQuery = personsRef.where('fullName', '==', searchName);
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
                                            // console.log("name", name)
                                            let companiesQuery = companiesRef.where('searchName', '==', searchName);
                                            await companiesQuery.get().then(async (companies: any) => {

                                                const searchResponse = await dueDilCompanySearch(searchName, "gb,ie,de,fr,ro,se"); // not 'es' or 'it'
                                                console.log(searchResponse);
                                                const results = await JSON.parse(searchResponse)
                                                const company = results?.companies?.find((c: any) => c.name?.toLowerCase() === searchName);
                                                let obj: any = {
                                                    searchName,
                                                    name
                                                }

                                                if (company && company.companyId) {
                                                    obj.companyId = company.companyId;

                                                    // get the vitals too.. 
                                                    // preserve the original name so the where 'name' == name still works

                                                    const vitalsResponse = await dueDilCompanyVitals(company.companyId, company?.countryCode.toLowerCase());
                                                    obj = { ...obj, ...JSON.parse(vitalsResponse) }

                                                }

                                                if (companies.empty) {
                                                    // console.log("companies", companies)
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



                            const directorDetails =
                                directorAndShareDetails?.directors?.Director;
                            const officers: any = await Promise.all(
                                directorDetails
                                    // what is shareholderType: 'O' ??
                                    .map(async (sourceOfficer: any) => {

                                        let officer: any = sourceOfficer

                                        let docId: any;

                                        const searchName = sourceOfficer?.name?.toLowerCase();

                                        if (sourceOfficer.birthdate === "") {
                                            // is a it a company?

                                            const searchResponse = await dueDilCompanySearch(searchName, "gb,ie,de,fr,ro,se"); // not 'es' or 'it'
                                            const results = await JSON.parse(searchResponse)
                                            const company = results?.companies?.find((c: any) => c.name?.toLowerCase() === searchName);
                                            if (company) {
                                                officer = { ...officer, ...company }

                                                const vitalsResponse = await dueDilCompanyVitals(company.companyId, company?.countryCode.toLowerCase());
                                                officer = { ...officer, ...JSON.parse(vitalsResponse) }
                                            }
                                        }

                                        const newOfficer = officer;

                                        // it's a person - see if we already have them in our DB and if not, add

                                        if (!newOfficer.companyId) {

                                            let personsQuery = personsRef.where('fullName', '==', searchName);
                                            await personsQuery.get().then(async (persons: any) => {

                                                if (persons.empty) {
                                                    const doc = await personsRef.add(newOfficer, { merge: true });
                                                    docId = doc.id;
                                                } else {
                                                    const personDoc = persons.docs[0];
                                                    docId = personDoc.id;
                                                    await personDoc.ref.update(newOfficer, { merge: true });
                                                }
                                            });
                                        }

                                        else {
                                            let companiesQuery = companiesRef.where('searchName', '==', searchName);
                                            await companiesQuery.get().then(async (companies: any) => {


                                                if (companies.empty) {
                                                    // console.log("companies", companies)
                                                    const doc = await companiesRef.add(newOfficer, { merge: true });
                                                    docId = doc.id;
                                                } else {
                                                    const companiesDoc = companies.docs[0];
                                                    docId = companiesDoc.id;
                                                    await companiesDoc.ref.update(newOfficer, { merge: true });
                                                }
                                            });
                                        }

                                        return { ...officer, docId }

                                    }));

                            if (shareholders || officers) {

                                // console.log("shareholders", shareholders)

                                if (officers) {
                                    await companyOfficersDocRef.set({ updateAt: new Date(), officers: officers.map((officer: any) => { return { docId: officer.docId }}) });
                                }

                                if (shareholders) {
                                    companyShareholdingsDocRef.set({ updateAt: new Date(), shareholders }).then(() => {

                                        companyShareholdingsDocRef
                                            .get().then(async (companyShareholdingsDoc: any) => {
                                                // console.log("companyShareholdingsDoc", companyShareholdingsDoc)
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
                                                    resolve(shareholders);
                                                } else {
                                                    resolve("missing data");
                                                }
                                            });

                                    })
                                } else {
                                    resolve("no shareholders");
                                }
                            }
                        }
                    })
                })
            }
        };

        go();

        console.log("finished");
    })
}

module.exports = functions.https.onRequest(server)