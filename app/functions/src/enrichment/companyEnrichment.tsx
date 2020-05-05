export { };

const functions = require('firebase-functions');
const admin = require("firebase-admin");

const cors = require('cors');
const express = require('express');

const { checkFATFCountry } = require("./checkFATFCountry");
const { checkFRNonCoopCountry } = require("./checkFRNonCoopCountry");

const server = express();
server.use(cors());

const db = admin.firestore();
let companyCollection = db.collection('companies');


const valueToObject = (value: any, sourceType: string = "blink", sourceCountry: string = "") => {
    return {
        value,
        updatedAt: new Date(),
        sourceType,
        sourceCountry,
        certification: "",
        validateion: "",
        evidence: "",
        evidenceExpiration: ""
    };
}

async function doCompanyEnrichment(companyRef: any) {
    
    let companyData = await (await companyRef.get()).data();
    if(companyData.countryCode && companyData.countryCode.value) {
        // check FATF Country    
        let isFATFCountry = valueToObject(await checkFATFCountry(companyData.countryCode.value));

        // check FR Non-Coop Country
        let isFRNonCoopCountry = valueToObject(await checkFRNonCoopCountry(companyData.countryCode.value));
        console.log ("Doing Company Enrichment");
        await companyRef.update({
            isFATFCountry: isFATFCountry,
            isFRNonCoopCountry: isFRNonCoopCountry
        }, { merge: true });
    }

    // Check NAICS code
}

async function doCompanyEnrichmentForCompanyId(companyId: string) {
    //Get company Ref from DB
    const targetCompanyQuery = await companyCollection.where('companyId.value', '==', companyId).get();
    let targetCompanyRef: any;
    if (targetCompanyQuery?.docs.length > 0) {
        targetCompanyRef = targetCompanyQuery?.docs[0].ref;
    }
    else {
        return("error, company not found");
    }

    return doCompanyEnrichment(targetCompanyRef);

    //Call enrichment function
}

async function doCompanyEnrichmentForId(id: string) {
    //Get company Ref from DB
    console.log("Starting Company Enrichment for ", id)
    const targetCompanyRef = await companyCollection.doc(id);
    let companyDoc = await targetCompanyRef.get();
    if (!companyDoc.exists) {
        return("error, company not found");
    }
    
    return doCompanyEnrichment(targetCompanyRef);
}

server.post('*/', async function (req: any, res: any) {
    const {
        companyId
    } = JSON.parse(req.body);
    // } = req.body;

    const response = await doCompanyEnrichmentForCompanyId(
        companyId
    )

    res.send(response);
})

module.exports = functions.https.onRequest(server);
module.exports.doCompanyEnrichment = doCompanyEnrichment;
module.exports.doCompanyEnrichmentForId = doCompanyEnrichmentForId;
