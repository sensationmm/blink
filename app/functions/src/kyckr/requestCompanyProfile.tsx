export { };
const functions = require('firebase-functions');
const admin = require("firebase-admin");
const cors = require('cors');
const express = require('express');
const server = express();
var soap = require('soap');

const fetchGoogleSheet = require('../google/fetchSheet').fetchGoogleSheet;
const dueDilCompanySearch = require('../duedill/searchCompany').searchCompany;
const dueDilCompanyVitals = require('../duedill/requestCompanyVitals').requestCompanyVitals;
const bloombergSearchCompany = require('../bloomberg/searchCompany').searchCompany;
const compositeExchangeCodes = require('../bloomberg/compositeExchangeCodes');

server.use(cors());

const valueToObject = (value: any, sourceType: string = "registry", sourceCountry: string = "") => {
    return {
        value,
        updatedAt: new Date(),
        sourceType,
        sourceCountry,
        certification: "",
        evidence: "",
        evidenceExpiration: ""
    };
}

const buildShareholderPerson = (shareholder: any) => {
    const firstName = shareholder?.name?.split(' ').slice(0, -1).join(' ');
    const lastName = shareholder?.name?.split(' ').slice(-1).join(' ');

    let newShareholder: any = {};

    if (shareholder.name) {
        newShareholder.fullName = valueToObject(shareholder?.name?.toLowerCase().replace(/  /g, " "));
    }
    if (firstName) {
        newShareholder.firstName = valueToObject(firstName);
    }
    if (lastName) {
        newShareholder.lastName = valueToObject(lastName);
    }
    if (shareholder?.dateOfBirth) {
        newShareholder.dateOfBirth = valueToObject(shareholder?.dateOfBirth);
    }
    return newShareholder;
}

const isCompanyByName = (name: string) => {
    return name?.indexOf("gmbh") > -1 ||
        name?.indexOf("hrb") > -1 ||
        name?.indexOf("limited") > -1 ||
        name?.indexOf("corporation") > -1 ||
        name?.slice(name.length - 3) === " ag" ||  // bit weak?
        name?.indexOf("ltd") > -1 ||
        name?.indexOf("s.r.l") > -1
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

    const entitiesAlreadyAdded: any = [];

    return new Promise(resolve => {

        const url = 'https://prodws.kyckr.co.uk/GBRDServices.asmx?wsdl';

        var args = { email: "terry.cordeiro@11fs.com", password: "6c72fde3", countryISOCode, companyCode: searchCode, orderReference, registrationAuthority, termsAndConditions: true };

        const auth = "Basic " + JSON.stringify({ "terry.cordeiro@11fs.com": "6c72fde3" })

        const go = async () => {
            let parentCompanyIsInDB = false;
            // THE PARENT COMPANY
            const targetCompanyQuery = await companyCollection.where('companyId.value', '==', companyCode).get();
            let targetCompanyRef: any;
            let targetCompany: any;
            if (targetCompanyQuery?.docs.length > 0) {
                parentCompanyIsInDB = true;
                targetCompanyRef = targetCompanyQuery?.docs[0].ref;
                targetCompany = targetCompanyQuery?.docs[0].data();
            } else {
                resolve("error, company not found");
            }

            if (ignoreDB === "true" || !parentCompanyIsInDB) {
                soap.createClient(url, { wsdl_headers: { Authorization: auth } }, function (err: any, client: any) {
                    client.CompanyProfile(args, async function (err: any, result: any) {

                        console.log("requesting company profile", searchCode);
                        if (err) {
                            console.log(err);
                        }

                        const directorAndShareDetails = result?.CompanyProfileResult?.CompanyProfile?.directorAndShareDetails;

                        let shareholders: any = [];
                        let officers: any = [];

                        // no shareholders so the company might be public..
                        const companiesResult = await bloombergSearchCompany(targetCompany.searchName.value);
                        const companies = JSON.parse(companiesResult)

                        if (companies?.results) {
                            const matchingCompanies = companies?.results.filter((company: any) => {
                                const matchingCompanyName = company.name.toLowerCase() === targetCompany.searchName.value
                                let matchingCountryCode = true;
                                if (targetCompany.countryCode.value) {
                                    matchingCountryCode = targetCompany.countryCode.value.toLowerCase() === company.country.toLowerCase();
                                }

                                return matchingCompanyName && matchingCountryCode
                            });
                            //  if (matchingCompanies.length > 0 ) {

                            const publicCompanyTypes = await fetchGoogleSheet('15rgjIj9PElEKw48TFGJoX87A_biUqpGqrVM2wOG4UQE', '1450221886');
                            // publicCompanyTypes && console.log("publicCompanyTypes", publicCompanyTypes);
                            // const cleanedPublicCompany

                            const publicCompanyFlags: any = {
                            }

                            if (publicCompanyTypes) {

                                publicCompanyFlags.isPublic = valueToObject(false, "blink")

                                // console.log("publicCompanyTypes", publicCompanyTypes)
                                const cleanedPublicCompanies = JSON.parse(publicCompanyTypes).filter((companyType: any) => {
                                    const { PublicLimitedLiabilityCompanyLongForm, PublicLimitedLiabilityCompanyShortForm } = companyType;
                                    return !!PublicLimitedLiabilityCompanyLongForm && !!PublicLimitedLiabilityCompanyShortForm
                                }).map((companyType: any) => {
                                    // console.log("companyType", companyType)
                                    return {
                                        PublicLimitedLiabilityCompanyLongForm: companyType.PublicLimitedLiabilityCompanyLongForm,
                                        PublicLimitedLiabilityCompanyShortForm: companyType.PublicLimitedLiabilityCompanyShortForm,
                                        countryCode: companyType["Alpha-2 code"]
                                    }
                                })
                                // .sort((companyTypeA: any, companyTypeB: any) => companyTypeA.countryCode.localeCompare(companyTypeB.countryCode));
                                const companyName = targetCompany.name?.value.toLowerCase();
                                if (targetCompany && targetCompany.countryCode) {
                                    const countryCodeCleanedPublicCompanies = cleanedPublicCompanies.filter((publicCompanyTypes: any) =>
                                        publicCompanyTypes.countryCode === targetCompany.countryCode);
                                    if (countryCodeCleanedPublicCompanies) {
                                        countryCodeCleanedPublicCompanies.forEach((countryCodeCleanedPublicCompany: any) => {
                                            const { PublicLimitedLiabilityCompanyShortForm } = countryCodeCleanedPublicCompany;
                                            const shortFormString = PublicLimitedLiabilityCompanyShortForm.toLowerCase();
                                            if (
                                                companyName.indexOf(" " + shortFormString) > -1
                                                ||
                                                companyName.indexOf(shortFormString + " ") > -1
                                            ) {
                                                publicCompanyFlags.isPublic.value = true;
                                            }
                                        });
                                    }
                                } else {
                                    cleanedPublicCompanies.forEach((cleanedPublicCompany: any) => {
                                        const { PublicLimitedLiabilityCompanyShortForm } = cleanedPublicCompany;
                                        const shortFormString = PublicLimitedLiabilityCompanyShortForm.toLowerCase();
                                        if (
                                            companyName.indexOf(" " + shortFormString) > -1
                                            ||
                                            companyName.indexOf(shortFormString + " ") > -1
                                        ) {
                                            publicCompanyFlags.isPublic.value = true;
                                            publicCompanyFlags.suspectedCountryFromName = valueToObject(cleanedPublicCompany.countryCode)
                                        }
                                    });
                                }
                            }

                            const bloombergExhangeData = valueToObject(matchingCompanies.map((matchingCompany: any) => {
                                return {
                                    securityType: matchingCompany.security_type,
                                    resourceId: matchingCompany.resource_id,
                                    tickerSymbol: matchingCompany.ticker_symbol
                                }
                            }), "bloomberg")

                            let citiCoveredExchange = valueToObject(false);
                            bloombergExhangeData.value.forEach((exchange: any) => {
                                const exchangeCode = exchange.tickerSymbol.split(":").pop();
                                if (compositeExchangeCodes.indexOf(exchangeCode) > -1) {
                                    citiCoveredExchange.value = true;
                                }

                            })

                            await targetCompanyRef.update({
                                bloomberg: bloombergExhangeData,
                                ...publicCompanyFlags,
                                // updatedAt: new Date(),
                                citiCoveredExchange
                            }, { merge: true });
                        }

                        if (directorAndShareDetails) {

                            const shareholderDetails =
                                directorAndShareDetails?.shareHolders?.ShareholderDetails;

                            if (shareholderDetails) {

                                for (let i = 0; i < shareholderDetails.length; i++) {
                                    await new Promise(async (next) => {
                                        const sourceShareholder = shareholderDetails[i];
                                        const searchName = sourceShareholder?.name?.toLowerCase().replace(/  /g, " ");
                                        const name = sourceShareholder?.name;
                                        // const shareholder = { ...sourceShareholder };
                                        const shareholder: any = {};
                                        Object.keys(sourceShareholder).forEach((key: string) => {
                                            shareholder[key] = valueToObject(sourceShareholder[key])
                                        })

                                        if (!shareholder.shareholderType.value) {
                                            const shareholderName = shareholder.name.value;
                                            if (
                                                isCompanyByName(shareholderName?.toLowerCase())
                                            ) {
                                                shareholder.shareholderType.value = "C";
                                            } else {
                                                shareholder.shareholderType.value = "P";
                                            }
                                        }
                                        // console.log("shareholder", shareholder);

                                        let ref: any;

                                        if (shareholder.shareholderType.value === "P") {

                                            const newShareholder = await buildShareholderPerson(sourceShareholder);

                                            // console.log("newShareholder", newShareholder)

                                            // it's a person - see if we already have them in our DB and if not, add

                                            let personsQuery = personsCollection.where('fullName.value', '==', searchName);
                                            await personsQuery.get().then(async (persons: any) => {

                                                const entityAlreadyAdded = entitiesAlreadyAdded.find((c: any) => c.searchName === searchName);

                                                if (entityAlreadyAdded) {
                                                    ref = entityAlreadyAdded.ref;
                                                    await ref.update({ ...newShareholder }, { merge: true });
                                                }
                                                else if (persons.empty) {
                                                    console.log("empty")
                                                    ref = await personsCollection.add({ ...newShareholder }, { merge: true });
                                                    entitiesAlreadyAdded.push({
                                                        searchName,
                                                        ref
                                                    })
                                                } else {
                                                    const personDoc = persons.docs[0];
                                                    ref = personDoc.ref;
                                                    // console.log("personDoc", personDoc?.ref.path)
                                                    await ref.update({ ...newShareholder }, { merge: true });
                                                }
                                            });

                                            // console.log("person Ref", ref)
                                        }
                                        
                                        if (shareholder.shareholderType.value === "C" || shareholder.shareholderType.value === "O") {

                                            let companiesQuery = companyCollection.where('searchName.value', '==', searchName);
                                            await companiesQuery.get().then(async (companies: any) => {

                                                let obj: any;
                                                let company;
                                                const searchResponse = await dueDilCompanySearch(searchName, "gb,ie,de,fr,ro,se"); // not 'es' or 'it' from duedil
                                                try {
                                                    if (searchResponse) {
                                                        const results = await JSON.parse(searchResponse)
                                                        company = results?.companies?.find((c: any) => c.name?.toLowerCase() === searchName);
                                                        obj = {
                                                            searchName,
                                                            name
                                                        }
                                                    }

                                                }
                                                catch (e) {
                                                    console.log(e)
                                                }
                                                if (company && company.companyId) {
                                                    obj.companyId = company.companyId;
                                                    shareholder.companyId = valueToObject(company.companyId);

                                                    // get the vitals too.. 
                                                    // preserve the original name so the "where 'name' == name" still works


                                                    // for DE will need to go to kyckr for the vitals and 'code' as they have their own proprietary code

                                                    const vitalsResponse = await dueDilCompanyVitals(company.companyId, company?.countryCode.toLowerCase());
                                                    try {
                                                        if (vitalsResponse && vitalsResponse.httpCode !== 400 && vitalsResponse.httpCode !== 404) {
                                                            obj = { ...obj, ...JSON.parse(vitalsResponse) }
                                                        }
                                                    }
                                                    catch (e) {
                                                        console.log(e)
                                                    }
                                                }

                                                const companyEnrichmentProperties: any = {};
                                                Object.keys(obj).forEach((key: any) => {
                                                    companyEnrichmentProperties[key] = valueToObject(obj[key]);
                                                })
                                                
                                                // console.log("searchName", searchName)
                                                const entityAlreadyAdded = entitiesAlreadyAdded.find((c: any) => c.searchName === searchName);

                                                if (entityAlreadyAdded) {
                                                    ref = entityAlreadyAdded.ref;
                                                    await ref.update({ ...companyEnrichmentProperties, 
                                                        // updatedAt: new Date() 
                                                    }, { merge: true });
                                                }
                                                else if (companies.empty) {
                                                    console.log("empty")
                                                    ref = await companyCollection.add({ ...companyEnrichmentProperties, 
                                                        // updatedAt: new Date() 
                                                    }, { merge: true });
                                                    entitiesAlreadyAdded.push({
                                                        searchName,
                                                        ref
                                                    })
                                                } else {
                                                    const companiesDoc = companies.docs[0];
                                                    ref = companiesDoc.ref
                                                    // console.log("ref 2", ref)
                                                    await ref.update({ ...companyEnrichmentProperties, 
                                                        // updatedAt: new Date() 
                                                    }, { merge: true });
                                                }
                                            });
                                        }

                                        // console.log("ref here", ref)

                                        shareholders.push({ ...shareholder, ref })

                                        next();

                                    });
                                }
                            }

                            const directorDetails =
                                directorAndShareDetails?.directors?.Director;
                            if (directorDetails) {

                                for (let i = 0; i < directorDetails.length; i++) {
                                    await new Promise(async (next) => {
                                        const sourceOfficer = directorDetails[i];

                                        let officer: any = sourceOfficer

                                        let ref: any;

                                        const searchName = sourceOfficer?.name?.toLowerCase().replace(/  /g, " ");

                                        if (
                                            sourceOfficer.birthdate === "" ||
                                            isCompanyByName(sourceOfficer?.name?.toLowerCase())) {

                                            const searchResponse = await dueDilCompanySearch(searchName, "gb,ie,de,fr,ro,se"); // not 'es' or 'it'
                                            if (searchResponse) {

                                                try {
                                                    const results = await JSON.parse(searchResponse);
                                                    const company = results?.companies?.find((c: any) => c.name?.toLowerCase() === searchName);
                                                    if (company) {
                                                        officer = { ...officer, ...company }

                                                        const vitalsResponse = await dueDilCompanyVitals(company.companyId, company?.countryCode.toLowerCase());
                                                        if (vitalsResponse) {
                                                            officer = { ...officer, ...JSON.parse(vitalsResponse) }
                                                        }
                                                    }
                                                }
                                                catch (e) {
                                                    console.log(e)
                                                }

                                            }
                                        }

                                        const newOfficer: any = {};
                                        Object.keys(officer).forEach((key:any) => {
                                            newOfficer[key] = valueToObject(officer[key]);
                                        });
                                        newOfficer.searchName = valueToObject(searchName);
                                        newOfficer.fullName = valueToObject(searchName);

                                        // it's a person - see if we already have them in our DB and if not, add

                                        if (!newOfficer.companyId) {

                                            let personsQuery = personsCollection.where('fullName.value', '==', searchName);
                                            await personsQuery.get().then(async (persons: any) => {

                                                const entityAlreadyAdded = entitiesAlreadyAdded.find((c: any) => c.searchName === searchName);

                                                if (entityAlreadyAdded) {
                                                    ref = entityAlreadyAdded.ref;
                                                    ref.update({ ...newOfficer, 
                                                        // updatedAt: new Date() 
                                                    }, { merge: true });
                                                }
                                                else if (persons.empty) {
                                                    ref = await personsCollection.add({ ...newOfficer, 
                                                        // updatedAt: new Date() 
                                                    }, { merge: true });
                                                    entitiesAlreadyAdded.push({
                                                        searchName,
                                                        ref
                                                    })
                                                } else {
                                                    const personDoc = persons.docs[0];
                                                    ref = personDoc.ref;
                                                    await personDoc.ref.update({ ...newOfficer, 
                                                        // updatedAt: new Date() 
                                                    }, { merge: true });
                                                }
                                            });
                                        }

                                        else {
                                            let companiesQuery = companyCollection.where('searchName.value', '==', searchName);
                                            await companiesQuery.get().then(async (companies: any) => {

                                                const entityAlreadyAdded = entitiesAlreadyAdded.find((c: any) => c.searchName === searchName);

                                                if (entityAlreadyAdded) {
                                                    ref = entityAlreadyAdded.ref;
                                                    await ref.update({ ...newOfficer, 
                                                        // updatedAt: new Date() 
                                                    }, { merge: true });
                                                }
                                                else if (companies.empty) {
                                                    // console.log("companies", companies)
                                                    ref = await companyCollection.add({ ...newOfficer, 
                                                        // updatedAt: new Date() 
                                                    }, { merge: true });
                                                    entitiesAlreadyAdded.push({
                                                        searchName,
                                                        ref
                                                    })
                                                } else {
                                                    const companiesDoc = companies.docs[0];
                                                    ref = companiesDoc.ref;
                                                    await companiesDoc.ref.update({ ...newOfficer, 
                                                        // updatedAt: new Date() 
                                                    }, { merge: true });
                                                }
                                            });
                                        }

                                        officers.push({ ...officer, ref })
                                        next();

                                    })
                                }
                            }
                            // console.log("shareholders", shareholders);

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

                                // console.log("relationship", relationship)

                                // check if we already have the relationship
                                const relationshipQuery = await relationshipsCollection
                                    .where('source', '==', relationship.source)
                                    .where('target', '==', targetCompanyRef)
                                    .where('type', '==', type).get()


                                // console.log("relationshipQuery", relationship.source, targetCompanyRef)

                                delete relationship.ref;
                                delete relationship.companyId;

                                delete relationship.address;
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
                                delete relationship.fullName;

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

                            if (shareholders.length > 0) {
                                await Promise.all(
                                    shareholders.map(async (shareholder: any) => {
                                        return await writeRelationship("shareholder", shareholder)
                                    })
                                );
                            }

                            if (officers.length > 0) {
                                await Promise.all(
                                    officers.map(async (officer: any) => {
                                        return await writeRelationship("officer", officer)
                                    })
                                );
                            }

                            // console.log(shareholders)
                            resolve({ shareholders, officers });



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