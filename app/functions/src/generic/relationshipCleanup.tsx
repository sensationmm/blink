export { };
const functions = require('firebase-functions');
const admin = require("firebase-admin");
const cors = require('cors');
const express = require('express');

const server = express();

server.use(cors());

server.get('*/', function (req: any, res: any) {

    const cleanup = async () => {
        
        const db = admin.firestore();
        const collections: any = {};
        const relationshipsCollection = db.collection('relationships');
        collections.relationships = relationshipsCollection;
        const entities: any = {};
    
        const relationshipsDocs = await collections.relationships.get();
    
        relationshipsDocs.forEach(async (relationship: any) => {
    
            const { source, target } = relationship.data();

            const sourceParts = source.path.split("/");
            const sourceCollection = sourceParts[0];
            if (!collections[sourceCollection]) {
                collections[sourceCollection] = db.collection(sourceCollection);
            }
            if (!entities[sourceCollection]) {
                entities[sourceCollection] = {};
            }

            const targetParts = target.path.split("/");
            const targetCollection = targetParts[0];
            if (!collections[targetCollection]) {
                collections[targetCollection] = db.collection(targetCollection);
            }
            if (!entities[targetCollection]) {
                entities[targetCollection] = {};
            }

            
            if (!entities[targetCollection][targetParts[1]]) {
                entities[targetCollection][targetParts[1]] = 1;
            } else {
                entities[targetCollection][targetParts[1]] += 1;
            }

            if (!entities[sourceCollection][sourceParts[1]]) {
                entities[sourceCollection][sourceParts[1]] = 1;
            } else {
                entities[sourceCollection][sourceParts[1]] += 1;
            }
        });

        const orphans: any = [];

        await Promise.all(Object.keys(entities).map(async (collection: any) => {
            await Promise.all(Object.keys(entities[collection]).map(async (entity: any) => {
                const doc = await collections[collection].doc(entity).get();
                if (!doc.exists) {
                    orphans.push(`${collection}/${entity}`)
                }
            }));
        }));

        res.send(orphans)
    } 

    cleanup();

})

module.exports = functions.https.onRequest(server);
