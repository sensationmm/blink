
export { };
const functions = require('firebase-functions');
const admin = require("firebase-admin");
const cors = require('cors');
const express = require('express');

const server = express();

server.use(cors());

server.get('*/:personFullName', function (req: any, res: any) {

    const {
        personFullName
    } = req.params

    const personRef = admin.firestore().collection('persons');

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

    const newPersonStructure: any = {};

    const personQuery = personRef.where('fullName', '==', personFullName);
    personQuery.get().then(async (persons: any) => {
        if (!persons.empty) {
            const personDoc = persons.docs[0];
            const personStructure = personDoc.data()
            Object.keys(personStructure).forEach(key => {
                if (key !== "filters" && key !== "pagination") {
                    const countryCode = personStructure.countryCode || "";
                    if (key === "updatedAt") {
                        newPersonStructure[key] = personStructure[key]
                    } else {
                        newPersonStructure[key] = valueToObject(personStructure[key], countryCode);
                    }
                }
            });
            personDoc.ref.set({ ...newPersonStructure, convertedOn: new Date() }).then((doc: any) => res.send(newPersonStructure));;
        } else {
            res.send(`${personFullName} not found`);
        }
    });

})

module.exports = functions.https.onRequest(server)