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
    const relationshipsCollection = db.collection('relationships');

    const getShareholdersAndOfficers = async (companyId: any, companyRef: string) => {

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
           
                if (shareholder.shareholderType === "C") {
                    if (shareholder.companyId) {
             
                        console.log("shareholder.shareholderType", shareholder.shareholderType, shareholder.companyId)

                        const companyShareholders = await getShareholdersAndOfficers(shareholder.companyId, shareholder.source);

                        if (companyShareholders) {
                            shareholder.shareholders = companyShareholders.shareholders.sort((shareholderA: any, shareholderB: any) => parseFloat(shareholderB.percentage) - parseFloat(shareholderA.percentage) );
                            shareholder.officers = companyShareholders.officers;
                        }

                    }
                    delete shareholder.source;
                    delete shareholder.target;
                    
                    return { ...shareholder }
                }

                delete shareholder.source;
                delete shareholder.target;

                return shareholder
            }))

            if (returnCompany.shareholders) {
                returnCompany.shareholders = returnCompany.shareholders.sort((shareholderA: any, shareholderB: any) => parseFloat(shareholderB.percentage) - parseFloat(shareholderA.percentage) );
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

            const shareholdersAndOfficers = await getShareholdersAndOfficers(companyId, companiesDoc.ref);
            if (shareholdersAndOfficers) {
                returnCompany = { ...returnCompany, ...shareholdersAndOfficers }
            }

            res.send(returnCompany)
        }

    });

})

module.exports = functions.https.onRequest(server);