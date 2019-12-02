
const functions = require('firebase-functions');

exports.requestCompany = functions.https.onRequest(require("./src/requestCompany"));
