export { }

const functions = require('firebase-functions');
const admin = require("firebase-admin");
const cors = require('cors');
const express = require('express');
const server = express();
server.use(cors());
server.get('*/:collection', async function (req: any, res: any) {
    
    const { collection } = req.params;
    const rules = await admin.firestore().collection(`${collection}Rules`).get();

    const rulesData = await Promise.all(rules.docs.map(async (rule: any) => {
        const data = await rule.data();
        return {...data, id: rule.id, path: rule.ref.path};
    }));

    return res.send(rulesData);
});
module.exports = functions.https.onRequest(server);
