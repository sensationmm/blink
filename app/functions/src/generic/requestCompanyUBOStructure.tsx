export { };
const functions = require('firebase-functions');
const admin = require("firebase-admin");
const cors = require('cors');
const express = require('express');

const server = express();

server.use(cors());

server.get('*/:source/:companyId/:countryISOCode', async function (req: any, res: any) {

    const {
        companyId,
    } = req.params;

    const db = admin.firestore();
    const companiesRef = db.collection('companies');
    const shareholdingsRef = db.collection('shareholdings');
    const officersRef = db.collection('officers');
    const personsRef = db.collection('persons');

    const getShareholdersAndOfficers = async (companyId: any) => {
        

        let shareholdingsQuery = shareholdingsRef.doc(companyId);
        const shareholdings = await shareholdingsQuery.get();

        let officersQuery = officersRef.doc(companyId);
        const officers = await officersQuery.get();

        const returnCompany: any = {
            shareholders: null,
            officers: null
        }

        if (officers.empty) {
            console.log("officers empty")
            delete returnCompany.officers
        } else {
            const companyOfficers = officers?.data()?.officers;
            if (companyOfficers) {
                returnCompany.officers = await Promise.all(companyOfficers.map(async (officer: any) => {
                    const personRef = await personsRef.doc(officer.docId).get();
                    const person = personRef.data();
                    return { ...person, ...officer }
                }))
            } else {
                delete returnCompany.officers
            }
        }

        if (shareholdings.empty) {
            console.log("shareholdings empty")
            delete returnCompany.shareholders
        } else {
            const companyShareholders = shareholdings?.data()?.shareholders;

            if (companyShareholders) {
                returnCompany.shareholders = await Promise.all(companyShareholders.map(async (shareholder: any) => {
                    if (shareholder.shareholderType === "C") {
                        const companyRef = await companiesRef.doc(shareholder.docId).get();
                        const company = companyRef.data();
                        if (company.companyId) {
                            // console.log(company.companyId)
                            const companyShareholders = await getShareholdersAndOfficers(company.companyId);
                            // console.log("company shareholders", shareholders)
                            if (companyShareholders) {
                                company.shareholders = companyShareholders.shareholders;
                                company.officers = companyShareholders.officers;
                            }
                        }
                        return { ...company, ...shareholder }
                    } else if (shareholder.shareholderType === "P") {
                        const personRef = await personsRef.doc(shareholder.docId).get();
                        const person = personRef.data();
                        return { ...person, ...shareholder }
                    }
                    else {
                        return shareholder;
                    }
                }))
            } else {
                delete returnCompany.shareholders
            }
        }
        if (Object.keys(returnCompany).length === 0) {
            return null
        }
        return returnCompany;
    }

    companiesRef.doc(companyId);

    let companiesQuery = companiesRef.where('companyId', '==', companyId);
    await companiesQuery.get().then(async (companies: any) => {

        let returnCompany: any;

        if (companies.empty) {
            console.log("companies empty")
            return res.status(404).send("not found");
        } else {
            const companiesDoc = companies.docs[0];
            returnCompany = companiesDoc.data();

            const shareholdersAndOfficers = await getShareholdersAndOfficers(companyId);
            // console.log(shareholders)
            if (shareholdersAndOfficers) {
                // console.log("shareholdersAndOfficers", shareholdersAndOfficers)
                returnCompany = { ...returnCompany, ...shareholdersAndOfficers }
            }

            res.send(returnCompany)
        }

    });

})

module.exports = functions.https.onRequest(server);


// if (shareholder.shareholderType === "C") {
//     const companyRef = await companiesRef.doc(shareholder.docId).get();
//     const company = companyRef.data();
//     if (company.companyId) {
//         // console.log(company.companyId)
//         const companyShareholders = await getShareholdersAndOfficers(company.companyId);
//         // console.log("company shareholders", shareholders)
//         if (companyShareholders) {
//             company.shareholders = companyShareholders;
//         }
//     }
//     return { ...company, ...shareholder }
// } else {
// if (officer.shareholderType === "P") {
// }
// else {
//     return officer;
// }