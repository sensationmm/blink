

const admin = require('firebase-admin');

admin.initializeApp();

exports.duedillSearchCompany = require("./src/duedill/searchCompany");

exports.duedillCompanyShareholders = require("./src/duedill/requestCompanyShareholders");

exports.kyckrSearchCompany = require("./src/kyckr/searchCompany");

exports.kyckrCompanyProfile = require("./src/kyckr/requestCompanyProfile");

exports.companiesHouseCompany = require("./src/companies-house/requestCompany");

exports.companiesHouseSearchCompany = require("./src/companies-house/searchCompany");

exports.companiesHousePersonsWithSignificantControl = require("./src/companies-house/requestPersonsWithSignificantControl");

exports.companiesHouseOfficers = require("./src/companies-house/requestOfficers");

exports.companiesHouseCompaniesWithSignificantControl = require("./src/companies-house/requestCompaniesWithSignificantControl");
