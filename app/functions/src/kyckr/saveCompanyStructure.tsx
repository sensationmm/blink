export { };
const functions = require('firebase-functions');
const admin = require("firebase-admin");
const cors = require('cors');
const express = require('express');

const server = express();

server.use(cors());

server.post('*/', function (req: any, res: any) {

    const {
        companyNumber,
        countryISOCode,
        companyStructure,
        ignoreCache
    } = JSON.parse(req.body);


    console.log(companyNumber);
    console.log(countryISOCode);
    console.log(companyStructure);

    const companyDoc = admin.firestore().collection('companies').doc(companyNumber);

    companyDoc.get().then((doc: any) => {
        if (!doc.exists) {
            return companyDoc.set({ [countryISOCode]: { ["kyckr"]: {...companyStructure, lastUpdated: new Date()} } }     ).then(() => res.send("ok"));
        } else {
            const companyDocData = doc.data();

            if (companyDocData[countryISOCode]) {
                if (companyDocData[countryISOCode]["kyckr"]) {
                    if (ignoreCache) {
                        companyDoc.update({ ...companyDocData[countryISOCode], ["kyckr"]: {...companyStructure, lastUpdated: new Date()} }).then(() => res.send("ok"));
                    }
                    return res.send(companyDocData[countryISOCode]["kyckr"])
                } else {
                    return companyDoc.update({ ...companyDocData[countryISOCode], ["kyckr"]: {...companyStructure, lastUpdated: new Date()} }).then(() => res.send("ok"));
                }
            } else {
                return companyDoc.update({ ...companyDocData, [countryISOCode]: { ["kyckr"]: {...companyStructure, lastUpdated: new Date()} } }).then(() => res.send("ok"));
            }

            // return companyDoc.set({ "kyckr": { ...companyStructure } }).then(() => res.send("ok"));
        }
    })

})

module.exports = functions.https.onRequest(server)