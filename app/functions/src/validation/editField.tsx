export { }

const functions = require('firebase-functions');
const admin = require("firebase-admin");
const cors = require('cors');
const express = require('express');
const server = express();
server.use(cors());
server.post('*/', async function (req: any, res: any) {
    const { docId, field, value, editedBy, merge = true } = req.body;

    const documentParts = docId.split("/");

    const newDocID = documentParts.pop();

    const doc = admin.firestore().collection(documentParts[0])
        .doc(newDocID);

        const docData = await(await doc.get()).data();

        if (!docData.edits) {
            docData.edits = []
        }

        docData.edits.push({
            editedBy,
            editedDate: new Date(),
            field,
            value,
            sourceType: "entry",
            previousValue: docData[field] || ""
        })

        doc.set({ ...docData, [field]: value }, { merge })

        .then(function (res: any) {
            console.log("Rule edited with ID: ", newDocID);
        })
        .catch(function (error: string) {
            console.error("Error editing rule: ", error);
        });

    return res.send({ msg: `Edited ${field}:${value}` });
});
module.exports = functions.https.onRequest(server);
