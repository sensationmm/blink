export { };
const { copyDocs } = require("./backuprestore");
const { deleteData } = require("./backuprestore");
const functions = require('firebase-functions');
const cors = require('cors');
const express = require('express');

const server = express();
server.use(cors());

server.get('*/:srcTimestamp/:destination?', async function (req: any, res: any) {
        
    const srcTimestamp = req.params.srcTimestamp;
    const destination = req.params.destination || '';
        
    console.log('Destination: '+destination);

    //create Destination Collection Names:
    const destCompanies = 'companies'+destination;
    const destPersons = 'persons'+destination;
    const destRelationships = 'relationships'+destination;

    const collectionNames = [destCompanies, destPersons, destRelationships];

    //set source collection for each datatype
    //1. companies<timestamp>
    const companiesSource = 'companies'+srcTimestamp;    
    
    //2. persons<timestamp>
    const personsSource = 'persons'+srcTimestamp;
    
    //3. relationships<timestamp>
    const relationshipsSource = 'relationships'+srcTimestamp;

    //Delete any docs in target collections
    for (const collectionName of collectionNames) {
        await deleteData(collectionName);
    }
    console.log('Finished deleting');

    
    //Now create copies of existing documents in restore location:
    await copyDocs(companiesSource, destCompanies);
    console.log('Finished companies');
    await copyDocs(personsSource, destPersons);
    console.log('Finished persons');
    await copyDocs(relationshipsSource, destRelationships);
    console.log('Finished relationships');
    
    res.send('Finished Restoring');

})

module.exports = functions.https.onRequest(server);
