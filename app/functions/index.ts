

const admin = require('firebase-admin');

admin.initializeApp();

exports.company = require("./src/requestCompany");

exports.personsWithSignificantControl = require("./src/requestPersonsWithSignificantControl");
