export { }

const functions = require('firebase-functions');
const admin = require("firebase-admin");
const cors = require('cors');
const express = require('express');
const server = express();
server.use(cors());
server.post('*/', function (req: any, res: any) {
    const { relationshipDocId } = req.body;

    const documentParts = relationshipDocId.split("/");

    const relationshipId = documentParts.pop();

    admin.firestore().collection('relationships').doc(relationshipId).delete().then(() => {
        console.log(`Deleted rule: ${relationshipId}`);
        return res.send({ msg: `UBO deleted: ${relationshipId}` });
    }).catch(function (error: any) {
        console.error("Error removing document: ", error);
        return res.send({ msg: `Error deleting UBO: ${relationshipId}` });
    });
});
module.exports = functions.https.onRequest(server);
