export { };
const { copyDocs } = require("./backuprestore");
const functions = require('firebase-functions');
const cors = require('cors');
const express = require('express');

const server = express();
server.use(cors());

server.get('*/', async function (req: any, res: any) {

    /*const {
        collectionName
    } = req.params
    */

    let now = new Date();
    console.log(now.toISOString());
    const nowString=now.toISOString().split('.')[0].replace(/[^0-9]/g,'');
    
    //create new backup collection for each datatype
    //1. companies<timestamp>
    let companiesBackup = 'companies'+nowString;    
    
    //2. persons<timestamp>
    let personsBackup = 'persons'+nowString;
    
    //3. relationships<timestamp>
    let relationshipsBackup = 'relationships'+nowString;

    
    //Now create copies of existing documents:
    await copyDocs('companies', companiesBackup);
    console.log('Finished companies');
    await copyDocs('persons', personsBackup);
    console.log('Finished persons');
    await copyDocs('relationships', relationshipsBackup);
    console.log('Finished relationships');
    res.send('Finished');

})

module.exports = functions.https.onRequest(server);
