

const admin = require('firebase-admin');

admin.initializeApp();

exports.kyckr = require("./src/kyckr");

exports.companiesHouseCompany = require("./src/companies-house/requestCompany");

exports.companiesHouseSearchCompany = require("./src/companies-house/searchCompany");

exports.companiesHousePersonsWithSignificantControl = require("./src/companies-house/requestPersonsWithSignificantControl");

exports.companiesHouseOfficers = require("./src/companies-house/requestOfficers");

exports.companiesHouseCompaniesWithSignificantControl = require("./src/companies-house/requestCompaniesWithSignificantControl");
