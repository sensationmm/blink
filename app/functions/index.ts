

const admin = require('firebase-admin');
const functions = require("firebase-functions");

admin.initializeApp({
    credential: admin.credential.cert({
        "type": "service_account",
        "project_id": "blink-3b651",
        "private_key_id": process.env.FIREBASE_SERVICE_ACCOUNT_PRIVATE_KEY_ID || functions.config().service_account_private_key_id.key,
        "private_key":  (`-----BEGIN PRIVATE KEY-----\n${process.env.FIREBASE_SERVICE_ACCOUNT_PRIVATE_KEY || functions.config().service_account_private_key.key}\n-----END PRIVATE KEY-----\n`).replace(/\\n/g, '\n'),
        "client_email":  process.env.FIREBASE_SERVICE_ACCOUNT_CLIENT_EMAIL || functions.config().service_account_client_email.key,
        "client_id":  process.env.FIREBASE_SERVICE_ACCOUNT_CLIENT_ID || functions.config().service_account_client_id.key,
        "auth_uri": "https://accounts.google.com/o/oauth2/auth",
        "token_uri": "https://oauth2.googleapis.com/token",
        "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
        "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-7ep8r%40blink-3b651.iam.gserviceaccount.com"
    }),
    databaseURL: "https://blink-3b651.firebaseio.com"
});

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
