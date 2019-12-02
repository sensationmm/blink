
const functions = require('firebase-functions');

exports.company = functions.https.onRequest(require("./src/requestCompany"));
