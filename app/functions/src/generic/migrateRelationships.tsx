
export { };
const functions = require('firebase-functions');
const admin = require("firebase-admin");
const cors = require('cors');
const express = require('express');

const server = express();

server.use(cors());

server.get('*/:shareholderType', function (req: any, res: any) {

    const {
        shareholderType
    } = req.params

    const db = admin.firestore();
    const relationshipsRef = db.collection('relationships');

    const valueToObject = (value: any, sourceType: string = "registry") => {
        return {
            value,
            updatedAt: new Date(),
            sourceType,
            certification: "",
            validation: '',
            evidence: "",
            evidenceExpiration: ""
        };
    }

    const newRelationship: any = {};

    const relationshipsQuery = relationshipsRef.where('shareholderType', '==', shareholderType);
    relationshipsQuery.get().then(async (relationships: any) => {
        if (!relationships.empty) {
            await Promise.all(relationships.docs.map(async (relationshipDoc: any) => {
                const relationship = relationshipDoc.data()
                Object.keys(relationship).forEach(key => {
                    if (key === "source" || key === "target" || key === "updatedAt" || key === "type") {
                        newRelationship[key] = relationship[key];
                    } else {
                        newRelationship[key] = valueToObject(relationship[key]);
                    }
                    // newRelationship[key] = {...relationship[key]}
                    // newRelationship[key].evidenceExpiration = newRelationship[key].evidenceExplaration;
                    // newRelationship[key].evidenceExplaration = db.FieldValue.delete();
                });
                return await relationshipDoc.ref.set({ ...newRelationship, convertedOn: new Date() })
                // return await relationshipDoc.ref.update({
                //     ...relationship,
                //     source: relationship.source.value,
                //     target: relationship.target.value,
                //     updatedAt: relationship.updatedAt.value,
                //     type: relationship.type.value
                // }, { merge: true })
            }));
            res.send(`${relationships.docs.length} documents found`)

        } else {
            res.send(`not found`);
        }
    });

})

module.exports = functions.https.onRequest(server)