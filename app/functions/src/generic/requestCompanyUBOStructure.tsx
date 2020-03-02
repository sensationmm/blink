export { };
const functions = require('firebase-functions');
const admin = require("firebase-admin");
const cors = require('cors');
const express = require('express');

const server = express();

server.use(cors());

// server.get('*/:source/:companyId/:countryISOCode', async function (req: any, res: any) {


server.post('*/', async function (req: any, res: any) {
    console.log(req.body)
    const {
        companyId,
    } = JSON.parse(req.body);

    const db = admin.firestore();
    const companiesRef = db.collection('companies');
    const relationshipsCollection = db.collection('relationships');

    const distinctShareholders: any = []

    const getShareholdersAndOfficers = async (companyId: any, companyRef: string, depth: number, totalShareholding: number) => {

        console.log("getShareholdersAndOfficers", companyId);

        const returnCompany: any = {
            shareholders: null,
            officers: null
        }

        const officerRelationships =
            await relationshipsCollection
                .where("target", "==", companyRef)
                .where("type", "==", "officer").get()

        if (officerRelationships.empty) {
            console.log("officers empty")
            delete returnCompany.officers
        } else {
            returnCompany.officers = await Promise.all(officerRelationships.docs.map(async (officerRelationship: any) => {
                const officerRelationshipDoc = await officerRelationship.data()
                const officerDoc = await officerRelationshipDoc.source.get()
                let officer = { ...officerDoc.data() };

                officer = { ...officer, ...officerRelationshipDoc };

                delete officer.source;
                delete officer.target;

                return officer
            }))
        }

        const shareholderRelationships =
            await relationshipsCollection
                .where("target", "==", companyRef)
                .where("type", "==", "shareholder").get()

        if (shareholderRelationships.empty) {
            console.log("shareholders empty")
            delete returnCompany.shareholders
        } else {
            returnCompany.shareholders = await Promise.all(shareholderRelationships.docs.map(async (shareholderRelationship: any) => {
                const shareholderRelationshipDoc = await shareholderRelationship.data()
                const shareholderDoc = await shareholderRelationshipDoc.source.get()
                let shareholder = { ...shareholderDoc.data() };
                shareholder = { ...shareholder, ...shareholderRelationshipDoc };

                shareholder.totalShareholding = (totalShareholding / 100) * (shareholder.percentage / 100);

                const distinctShareholderIndex = distinctShareholders.findIndex((distinctShareholder: any) =>
                    distinctShareholder.docId === shareholder.source.path);

                if (distinctShareholderIndex > -1) {
                    distinctShareholders[distinctShareholderIndex].totalShareholding += (totalShareholding / 100) * shareholder.percentage;
                } else {
                    distinctShareholders.push({
                        ...shareholder,
                        totalShareholding: (totalShareholding / 100) * shareholder.percentage,
                        name: shareholder.name || shareholder.fullName,
                        shareholderType: shareholder.shareholderType,
                        docId: shareholder.source.path
                    })
                }

                if (shareholder.shareholderType === "C") {
                    if (shareholder.companyId) {

                        // console.log("shareholder.shareholderType", shareholder.shareholderType, shareholder.companyId)

                        const companyShareholders = await getShareholdersAndOfficers(shareholder.companyId, shareholder.source, depth + 1, (totalShareholding / 100) * shareholder.percentage);

                        if (companyShareholders) {
                            if (companyShareholders.shareholders) {
                                shareholder.shareholders = companyShareholders.shareholders.sort((shareholderA: any, shareholderB: any) => parseFloat(shareholderB.percentage) - parseFloat(shareholderA.percentage));
                            }
                            shareholder.officers = companyShareholders.officers;
                        }

                    }
                    shareholder.docId = shareholder.source.path;

                    delete shareholder.source;
                    delete shareholder.target;

                    if (shareholder.shareholders) {
                        const index = distinctShareholders.findIndex((distinctShareholder: any) =>
                            distinctShareholder.docId === shareholder.docId);
                        if (index > -1) {
                            distinctShareholders.splice(index, 1);
                        }
                    }

                    return { ...shareholder, depth }
                }

                shareholder.docId = shareholder.source.path;

                delete shareholder.source;
                delete shareholder.target;

                return shareholder
            }))

            if (returnCompany.shareholders) {
                returnCompany.shareholders = returnCompany.shareholders.sort((shareholderA: any, shareholderB: any) => parseFloat(shareholderB.percentage) - parseFloat(shareholderA.percentage));
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
            returnCompany.docId = companiesDoc.ref.path;

            const shareholdersAndOfficers = await getShareholdersAndOfficers(companyId, companiesDoc.ref, 1, 100);
            if (shareholdersAndOfficers) {
                returnCompany = { ...returnCompany, ...shareholdersAndOfficers, distinctShareholders: distinctShareholders.sort((a: any, b: any) => b.totalShareholding - a.totalShareholding) }
            }

            res.send(returnCompany)
        }

    });

})

module.exports = functions.https.onRequest(server);