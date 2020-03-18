
export { };
const functions = require('firebase-functions');
const admin = require("firebase-admin");
const cors = require('cors');
const express = require('express');

const server = express();

server.use(cors());

server.get('*/:companyName', function (req: any, res: any) {

    const {
        companyName
    } = req.params

    const companyRef = admin.firestore().collection('companies');

    const valueToObject = (value: any, sourceCountry: string = "", sourceType: string = "registry") => {
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

    const newCompanyStructure: any = {};

    const companyQuery = companyRef.where('searchName', '==', companyName);
    companyQuery.get().then(async (companies: any) => {
        if (!companies.empty) {
            const companyDoc = companies.docs[0];
            const companyStructure = companyDoc.data()
            Object.keys(companyStructure).forEach(key => {
                if (key !== "filters" && key !== "pagination") {
                    const countryCode = companyStructure.countryCode || ""
                    if (key === "updatedAt") {
                        newCompanyStructure[key] = companyStructure[key]
                    } else {
                        if (key === "bloomberg") {
                            newCompanyStructure[key] = valueToObject(companyStructure[key], countryCode, "bloomberg");
                        } else {
                            newCompanyStructure[key] = valueToObject(companyStructure[key], countryCode);
                        }
                     
                    }
                    
                }
            });
            companyDoc.ref.set({ ...newCompanyStructure, convertedOn: new Date() }).then((doc: any) => res.send(newCompanyStructure));;
        } else {
            res.send("not found");
        }
    });

})

module.exports = functions.https.onRequest(server)