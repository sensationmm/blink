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
    const isRule = documentParts[0] === "companyRules" || documentParts[0] === "personRules";
    const newDocID = documentParts.pop();

    const arraysEqual = (a: Array<any>, b: Array<any>) => {
        if (a === b) return true;
        if (a == null || b == null) return false;
        if (a.length != b.length) return false;

        // sort?

        for (var i = 0; i < a.length; ++i) {
            if (a[i] !== b[i]) return false;
        }
        return true;
    }

    const doc = admin.firestore().collection(documentParts[0])
        .doc(newDocID);

    const docData = await (await doc.get()).data();

    if (!docData.edits) {
        docData.edits = []
    }

    const previousValue = docData[field]?.value || docData[field];
    const newValue = value?.value || value;

    const wasNullAndIsNowEmptyString = previousValue && newValue === "";
    const isSameValue = previousValue === newValue || (Array.isArray(newValue) && arraysEqual(newValue, previousValue));

    const fieldHasChanged = !(wasNullAndIsNowEmptyString || isSameValue);

    if (fieldHasChanged) {
        console.log(field, value);
    }

    if (isRule || fieldHasChanged) {
        docData.edits.push({
            editedBy,
            editedDate: new Date(),
            field,
            value,
            previousValue: docData[field] || ""
        });

        if (!isRule && fieldHasChanged && typeof value === 'object') {
            value.sourceType = "entry";
        }

        doc.set({ ...docData, [field]: value }, { merge })

            .then(function (res: any) {
                if (!fieldHasChanged) {
                    console.log("No changes", newDocID);
                } else {
                    console.log("Rule edited with ID: ", newDocID);
                }

            })
            .catch(function (error: string) {
                console.error("Error editing rule: ", error);
            });

        return res.send({ msg: `Edited ${field}:${value.value}` });

    } else {
        return res.send({ msg: `No changes ${field}` });
    }

});
module.exports = functions.https.onRequest(server);
