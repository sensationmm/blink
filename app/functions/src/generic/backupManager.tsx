export { };
const { getAvailableBackups } = require("./backuprestore");

const functions = require('firebase-functions');
const cors = require('cors');
const express = require('express');

const server = express();
server.use(cors());

server.get('*/', async function (req: any, res: any) {

    //Now create copies of existing documents in restore location:
    const backupMap = await getAvailableBackups();
    
    let response = '<a href="../backupAllData">Backup Now</a><br>';
    response += '<br>Available Backups:<br>'
    
    for (const backupKey of backupMap.keys() ) {
        response += backupMap.get(backupKey)+' <a href="../restoreAllData/'+backupKey+'">Restore Now</a><br>';
    }
    res.send(response);

})

module.exports = functions.https.onRequest(server);
