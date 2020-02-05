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
    const personsRef = db.collection('persons');

    const getShareholders = async (companyId: any) => {
        let shareholdingsQuery = shareholdingsRef.doc(companyId);
        const shareholdings = await shareholdingsQuery.get();

        if (shareholdings.empty) {
            console.log("shareholdings empty")
            return null;
        } else {
            const shareholders = shareholdings?.data()?.shareholders;
            if (shareholders) {
                return await Promise.all(shareholders.map(async (shareholder: any) => {
                    if (shareholder.shareholderType === "C") {
                        const companyRef = await companiesRef.doc(shareholder.docId).get();
                        const company = companyRef.data();
                        if (company.companyId) {
                            // console.log(company.companyId)
                            const companyShareholders = await getShareholders(company.companyId);
                            // console.log("company shareholders", shareholders)
                            if (companyShareholders) {
                                company.shareholders = companyShareholders;
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
                return null;
            }
        }
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

            const shareholders = await getShareholders(companyId);
            // console.log(shareholders)
            if (shareholders) {
                returnCompany.shareholders = shareholders
            }

            res.send(returnCompany)
        }

    });

})

module.exports = functions.https.onRequest(server);