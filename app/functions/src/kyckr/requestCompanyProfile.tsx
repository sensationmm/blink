export { };
const functions = require('firebase-functions');
const admin = require("firebase-admin");
const cors = require('cors');
const express = require('express');
const server = express();

var soap = require('soap');
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

server.get('*/:companyCode/:/searchCode/:countryISOCode/:orderReference/:registrationAuthority', async function (req: any, res: any) {
    console.log("get requestCompanyProfile");
    const {
        companyCode,
        searchCode,
        countryISOCode,
        orderReference,
        registrationAuthority,
    } = req.params;

    const response = await requestCompanyProfile(
        companyCode,
        searchCode,
        countryISOCode,
        orderReference,
        registrationAuthority,
        req.query.ignoreDB
    )

    res.send(response);

});


server.post('*/', async function (req: any, res: any) {

    console.log("post requestCompanyProfile");

    const {
        companyId,
        searchCode,
        countryISOCode,
        orderReference,
        registrationAuthorityCode
    } = JSON.parse(req.body);
    // } = req.body;

    const response = await requestCompanyProfile(
        companyId,
        searchCode,
        countryISOCode,
        orderReference,
        registrationAuthorityCode,
        req.query.ignoreDB
    )

    res.send(response);

});


const db = admin.firestore();
// let personsRef = db.collection('persons');
// let shareholdingsRef = db.collection('shareholdings');
// let officersRef = db.collection('officers');

let companyCollection = db.collection('companies');
let relationshipsCollection = db.collection('relationships');
let personsCollection = db.collection('persons');


const requestCompanyProfile = async (
    companyCode: any,
    searchCode: any,
    countryISOCode: any,
    orderReference: any,
    registrationAuthority: any,
    ignoreDB: string

) => {

    console.log("params", searchCode, countryISOCode, orderReference, registrationAuthority, ignoreDB);

    return new Promise(resolve => {

        const url = 'https://prodws.kyckr.co.uk/GBRDServices.asmx?wsdl';

        var args = { email: "terry.cordeiro@11fs.com", password: "6c72fde3", countryISOCode, companyCode: searchCode, orderReference, registrationAuthority, termsAndConditions: true };

        const auth = "Basic " + JSON.stringify({ "terry.cordeiro@11fs.com": "6c72fde3" })
        // // const companyShareholdingsDocRef = shareholdingsRef.doc(companyCode)
        // const companyOfficersDocRef = officersRef.doc(companyCode)
        // const relationshipsRef = relationshipsCollection.doc(companyCode)

        const go = async () => {

            // const companyShareholdingsDoc = await companyShareholdingsDocRef
            //     .get()

            // const companyOfficersDoc = await companyOfficersDocRef
            //     .get()

            // console.log("companyRelationshipsQuery", companyRelationshipsQuery)

            let parentCompanyIsInDB = false;
            // THE PARENT COMPANY
            const targetCompanyQuery = await companyCollection.where('companyId', '==', companyCode).get();


            // console.log("targetCompanyQuery?.docs.length", targetCompanyQuery?.docs.length)

            let targetCompanyRef: any;
            if (targetCompanyQuery?.docs.length > 0) {
                parentCompanyIsInDB = true;
                targetCompanyRef = targetCompanyQuery?.docs[0].ref;
            } else {
                // add the company 
                // get the ref  
                // const obj = {
                //     companyId: companyCode,
                //     name: "new Co",
                //     searchName: "new co"
                // };
                // const targetCompany = await companyCollection.add(obj, { merge: true })
                // targetCompanyRef = targetCompany.ref;
                resolve("error, company not found");
            }

            if (ignoreDB === "true" ||
                !parentCompanyIsInDB
                // || !companyShareholdingsDoc.exists || !companyOfficersDoc.exists
            ) {


                soap.createClient(url, { wsdl_headers: { Authorization: auth } }, function (err: any, client: any) {
                    client.CompanyProfile(args, async function (err: any, result: any) {

                        console.log("requesting company profile", searchCode);
                        if (err) {
                            console.log(err);
                        }

                        const directorAndShareDetails = result?.CompanyProfileResult?.CompanyProfile?.directorAndShareDetails;

                        if (directorAndShareDetails) {

                            const shareholderDetails =
                                directorAndShareDetails?.shareHolders?.ShareholderDetails;

                            let shareholders: any;
                            if (shareholderDetails) {

                                shareholders = await Promise.all(
                                    shareholderDetails
                                        .map(async (sourceShareholder: any) => {

                                            const searchName = sourceShareholder?.name?.toLowerCase();
                                            const name = sourceShareholder?.name;

                                            const shareholder = { ...sourceShareholder };


                                            if (!shareholder.shareholderType) {
                                                const shareholderName = shareholder.name;
                                                if (
                                                    // DE specific
                                                    // weak logic right now - will need to be better
                                                    // german ltd
                                                    shareholderName?.toLowerCase().indexOf("gmbh") > -1 ||
                                                    shareholderName?.indexOf("HRB") > -1 ||
                                                    shareholderName?.indexOf("limited") > -1
                                                ) {
                                                    shareholder.shareholderType = "C";
                                                } else {
                                                    shareholder.shareholderType = "P";
                                                }
                                            }
                                            // console.log("shareholder", shareholder);

                                            let ref: any;

                                            if (shareholder.shareholderType === "P") {

                                                const newShareholder = await buildShareholderPerson(sourceShareholder);

                                                // console.log("newShareholder", newShareholder)

                                                // it's a person - see if we already have them in our DB and if not, add

                                                let personsQuery = personsCollection.where('fullName', '==', searchName);
                                                await personsQuery.get().then(async (persons: any) => {

                                                    if (persons.empty) {
                                                        console.log("empty")
                                                        ref = await personsCollection.add({ ...newShareholder, updatedAt: new Date() }, { merge: true });
                                                        
                                                    } else {
                                                        const personDoc = persons.docs[0];
                                                        ref = personDoc.ref;
                                                        // console.log("personDoc", personDoc?.ref.path)
                                                        await ref.update({...newShareholder, updatedAt: new Date()}, { merge: true });
                                                    }
                                                });

                                                // console.log("person Ref", ref)
                                            }

                                            if (shareholder.shareholderType === "C" || shareholder.shareholderType === "O") {


                                                let companiesQuery = companyCollection.where('searchName', '==', searchName);
                                                await companiesQuery.get().then(async (companies: any) => {

                                                    const searchResponse = await dueDilCompanySearch(searchName, "gb,ie,de,fr,ro,se"); // not 'es' or 'it' from duedil
                                                    // console.log(searchResponse);
                                                    const results = await JSON.parse(searchResponse)
                                                    const company = results?.companies?.find((c: any) => c.name?.toLowerCase() === searchName);
                                                    let obj: any = {
                                                        searchName,
                                                        name
                                                    }

                                                    if (company && company.companyId) {
                                                        obj.companyId = company.companyId;
                                                        shareholder.companyId = company.companyId;

                                                        // get the vitals too.. 
                                                        // preserve the original name so the "where 'name' == name" still works


                                                        // for DE will need to go to kyckr for the vitals and 'code' as they have their own proprietary code

                                                        const vitalsResponse = await dueDilCompanyVitals(company.companyId, company?.countryCode.toLowerCase());
                                                        if (vitalsResponse && vitalsResponse.httpCode !== 400 && vitalsResponse.httpCode !== 404) {
                                                            obj = { ...obj, ...JSON.parse(vitalsResponse) }
                                                        }

                                                    }


                                                    console.log(searchName, `empty = ${companies.empty}`)

                                                    if (companies.empty) {
                                                        // console.log("companies", companies)
                                                        ref = await companyCollection.add({ ...obj, updatedAt: new Date() }, { merge: true });
                                                        // console.log("ref 1", ref)
                                                    } else {
                                                        const companiesDoc = companies.docs[0];
                                                        ref = companiesDoc.ref
                                                        // console.log("ref 2", ref)
                                                        await ref.update({...obj, updatedAt: new Date()}, { merge: true });
                                                    }
                                                });
                                            }

                                            // console.log("ref here", ref)

                                            return { ...shareholder, ref }

                                        }));

                            }

                            const directorDetails =
                                directorAndShareDetails?.directors?.Director;
                            const officers: any = await Promise.all(
                                directorDetails
                                    // what is shareholderType: 'O' ??
                                    .map(async (sourceOfficer: any) => {

                                        let officer: any = sourceOfficer

                                        let ref: any;

                                        const searchName = sourceOfficer?.name?.toLowerCase();

                                        if (
                                            sourceOfficer.birthdate === "" ||
                                            sourceOfficer.name.toLowerCase().indexOf("limited") > -1) {
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
                                        newOfficer.searchName = searchName;
                                        newOfficer.fullName = searchName;

                                        // it's a person - see if we already have them in our DB and if not, add

                                        if (!newOfficer.companyId) {

                                            let personsQuery = personsCollection.where('fullName', '==', searchName);
                                            await personsQuery.get().then(async (persons: any) => {

                                                if (persons.empty) {
                                                    ref = await personsCollection.add({ ...newOfficer, updatedAt: new Date() }, { merge: true });
                                                } else {
                                                    const personDoc = persons.docs[0];
                                                    ref = personDoc.ref;
                                                    await personDoc.ref.update({...newOfficer, updatedAt: new Date()}, { merge: true });
                                                }
                                            });
                                        }

                                        else {
                                            let companiesQuery = companyCollection.where('searchName', '==', searchName);
                                            await companiesQuery.get().then(async (companies: any) => {

                                                if (companies.empty) {
                                                    // console.log("companies", companies)
                                                    ref = await companyCollection.add({ ...newOfficer, updatedAt: new Date() }, { merge: true });
                                                } else {
                                                    const companiesDoc = companies.docs[0];
                                                    ref = companiesDoc.ref;
                                                    await companiesDoc.ref.update({ ...newOfficer, updatedAt: new Date() }, { merge: true });
                                                }
                                            });
                                        }

                                        return { ...officer, ref }

                                    }));


                            if (shareholders
                                || officers
                            ) {

                                // console.log(targetCompanyRef);

                                // resolve({ shareholders, officers })

                                console.log("shareholders", shareholders)

                                const writeRelationship = async (type: string, entity: any) => {

                                    // console.log("WRITE RELATIONSHIP WRITE RELATIONSHIP WRITE RELATIONSHIP")

                                    // console.log("entity", entity)

                                    const relationship = {
                                        ...entity,
                                        source: entity.ref,
                                        target: targetCompanyRef,
                                        type,
                                        updatedAt: new Date()
                                    }

                                    // check if we already have the relationship
                                    const relationshipQuery = await relationshipsCollection
                                        .where('source', '==', relationship.source)
                                        .where('target', '==', targetCompanyRef)
                                        .where('type', '==', type).get()
                                        

                                        // console.log("relationshipQuery", relationship.source, targetCompanyRef)

                                        delete relationship.ref;
                                        delete relationship.companyId;
                                        delete relationship.address1;
                                        delete relationship.address2;
                                        delete relationship.address3;
                                        delete relationship.address4;
                                        delete relationship.address5;
                                        delete relationship.address6;
                                        delete relationship.birthdate;
                                        delete relationship.directorships;
                                        delete relationship.name;
                                        delete relationship.searchName;
                                        delete relationship.nationality;
                                        delete relationship.postcode;

                                        // console.log(relationship)

                                    if (relationshipQuery?.docs && relationshipQuery?.docs.length === 0) {
                                        await relationshipsCollection.add({
                                            ...relationship
                                        });
                                    } else {
                                        const relationshipDoc = relationshipQuery?.docs[0]
                                        const ref = relationshipDoc.ref;
                                        return ref.update({ ...relationship }, { merge: true });
                                    }
                                }

                                   

                                await Promise.all(
                                    shareholders.map(async (shareholder: any) => {
                                        return await writeRelationship("shareholder", shareholder)
                                    })
                                );

                                await Promise.all(
                                    officers.map(async (officer: any) => {
                                        return await writeRelationship("officer", officer)
                                    })
                                );

                          

                                // console.log(shareholders)
                                resolve({shareholders, officers});

                            }

                        } else {
                            console.log("no results / shareholders")
                            return resolve("no results / shareholders");
                        }

                    })
                })
            }
        };


        go();

        // console.log("finished");
    })
}


module.exports = functions.https.onRequest(server)