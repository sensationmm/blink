

const admin = require('firebase-admin');

admin.initializeApp();

exports.kyckr = require("./src/kyckr");

exports.company = require("./src/requestCompany");

exports.searchCompany = require("./src/searchCompany");

exports.personsWithSignificantControl = require("./src/requestPersonsWithSignificantControl");

exports.officers = require("./src/requestOfficers");

exports.companiesWithSignificantControl = require("./src/requestCompaniesWithSignificantControl");
