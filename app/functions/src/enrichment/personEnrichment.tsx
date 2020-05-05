export { };

const admin = require("firebase-admin");

const cors = require('cors');
const express = require('express');

const { checkFATFCountry } = require("./checkFATFCountry");

const server = express();
server.use(cors());

const db = admin.firestore();
let personCollection = db.collection('persons');


const valueToObject = (value: any, sourceType: string = "blink", sourceCountry: string = "") => {
    return {
        value,
        updatedAt: new Date(),
        sourceType,
        sourceCountry,
        certification: "",
        validation: "",
        evidence: "",
        evidenceExpiration: ""
    };
}

async function doPersonEnrichment(personRef: any) {
    
    let personData = await (await personRef.get()).data();
    if(personData.countryCode && personData.countryCode.value) {
        // check FATF Country    
        let isFATFCountry = valueToObject(await checkFATFCountry(personData.countryCode.value));

        await personRef.update({
            isFATFCountry: isFATFCountry,
        }, { merge: true });
    }
}

async function doPersonEnrichmentForId(personId: string) {
    //Get person Ref from DB
    const targetPersonRef = await personCollection.doc(personId);
    let personDoc = await targetPersonRef.get();
    if (!personDoc.exists) {
        return("error, person not found");
    }
    
    return doPersonEnrichment(targetPersonRef);

    //Call enrichment function
}

module.exports.doPersonEnrichment = doPersonEnrichment;
module.exports.doPersonEnrichmentForId = doPersonEnrichmentForId;