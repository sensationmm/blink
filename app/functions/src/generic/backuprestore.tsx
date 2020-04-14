export { };

const admin = require("firebase-admin");

async function copyDocs(sourceCollectionName: string, destCollectionName: string) {
    const db = admin.firestore();

    const documents = await db.collection(sourceCollectionName).get();
    let writeBatch = admin.firestore().batch();
    const destCollection = db.collection(destCollectionName);
    let i = 0;

    for (const doc of documents.docs) {
        writeBatch.set(destCollection.doc(doc.id), doc.data());
        console.log('Copied doc: '+doc.id);
        i++;
        if (i > 400) {  // write batch only allows maximum 500 writes per batch
            i = 0;
            console.log('Intermediate committing of batch operation');
            await writeBatch.commit();
            writeBatch = admin.firestore().batch();
        }
    }
    if (i > 0) {
        console.log('Firebase batch operation completed for '+i+' docs from '+sourceCollectionName
                   +'to '+destCollectionName+'. Doing final committing of batch operation.');
        await writeBatch.commit();
    } else {
        console.log('Firebase batch operation completed for '+destCollectionName+'.');
    }
}

async function deleteData(collectionName: string) {
    const db = admin.firestore();

    //delete data in batches
    console.log('Deleting '+collectionName);

    let collectionRef = await db.collection(collectionName);
    let query = await collectionRef.orderBy('__name__'); //.limit(400); can add a limit for batching deletes
    let docsSnapshot = await query.get();

    if (docsSnapshot.size === 0)
        console.log('no documents to delete - move on');

    let batch = db.batch();
    for (const doc of docsSnapshot.docs) {
        await batch.delete(doc.ref);
        console.log('Deleted doc: '+doc.id);
    }
    await batch.commit();
    console.log('Completed deleting '+collectionName);
}

async function getAvailableBackups() {
    const db = admin.firestore();

    console.log('finding all available collections');
    let backupMap = new Map();

    const collections = await db.listCollections();
    for (let collection of collections) {
        let timestamp = collection.id.match(/[0-9]{14}/g)
        if (timestamp) {
            console.log(`Found collection with id: ${collection.id}`);
            let dateString = timestamp[0].replace(/([0-9]{4})([0-9]{2})([0-9]{2})([0-9]{2})([0-9]{2})([0-9]{2})/g,
                                                  '$1-$2-$3 $4:$5:$6 UTC');
            console.log(dateString);
            if (!backupMap.has(timestamp[0])) {
                backupMap.set(timestamp[0], dateString);
            }
        }
    }
    console.log(backupMap);
    return backupMap;
}

module.exports.copyDocs = copyDocs; 
module.exports.deleteData = deleteData; 
module.exports.getAvailableBackups = getAvailableBackups; 
