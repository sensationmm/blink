

const admin = require('firebase-admin');
const functions = require("firebase-functions");

admin.initializeApp();

exports.duedillSearchCompany = require("./src/duedill/searchCompany");

exports.duedillCompanyShareholders = require("./src/duedill/requestCompanyShareholders");

exports.duedillCompanyPersonsOfSignificantControl = require("./src/duedill/requestCompanyPersonsOfSignificantControl");

exports.kyckrSearchCompany = require("./src/kyckr/searchCompany");

exports.kyckrCompanyProfile = require("./src/kyckr/requestCompanyProfile");

exports.kyckrCompanyOfficials = require("./src/kyckr/requestCompanyOfficials");

exports.companiesHouseCompany = require("./src/companies-house/requestCompany");

exports.companiesHouseSearchCompany = require("./src/companies-house/searchCompany");

exports.companiesHousePersonsWithSignificantControl = require("./src/companies-house/requestPersonsWithSignificantControl");

exports.companiesHouseOfficers = require("./src/companies-house/requestOfficers");

exports.companiesHouseCompaniesWithSignificantControl = require("./src/companies-house/requestCompaniesWithSignificantControl");

exports.truliooIdentityVerification = require("./src/trulioo/indentityVerification");

exports.truliooIdentityVerificationCountryCodes = require("./src/trulioo/identityVerificationCountryCodes");

exports.truliooDocumentVerificationCountryCodes = require("./src/trulioo/documentVerificationCountryCodes");

exports.truliooDocumentVerificationTypes = require("./src/trulioo/documentVerificationTypes");

exports.truliooDocumentVerification = require("./src/trulioo/documentVerification");

exports.truliooBusinessSearch = require("./src/trulioo/businessSearch");
