

const admin = require('firebase-admin');

admin.initializeApp();

exports.company = require("./src/requestCompany");

exports.searchCompany = require("./src/searchCompany");

exports.personsWithSignificantControl = require("./src/requestPersonsWithSignificantControl");

exports.companiesWithSignificantControl = require("./src/requestCompaniesWithSignificantControl");
