

const admin = require('firebase-admin');
const functions = require("firebase-functions");

admin.initializeApp({
    credential: admin.credential.cert({
        "type": "service_account",
        "project_id": process.env.FIREBASE_PROJECT_ID || functions.config().project_id.key,
        "private_key_id": process.env.FIREBASE_SERVICE_ACCOUNT_PRIVATE_KEY_ID || functions.config().service_account_private_key_id.key,
        "private_key": (`-----BEGIN PRIVATE KEY-----\n${process.env.FIREBASE_SERVICE_ACCOUNT_PRIVATE_KEY || functions.config().service_account_private_key.key}\n-----END PRIVATE KEY-----\n`).replace(/\\n/g, '\n'),
        "client_email": process.env.FIREBASE_SERVICE_ACCOUNT_CLIENT_EMAIL || functions.config().service_account_client_email.key,
        "client_id": process.env.FIREBASE_SERVICE_ACCOUNT_CLIENT_ID || functions.config().service_account_client_id.key,
        "auth_uri": "https://accounts.google.com/o/oauth2/auth",
        "token_uri": "https://oauth2.googleapis.com/token",
        "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
        "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-dxiff%40blink-staging-20006.iam.gserviceaccount.com"
    }),
    databaseURL: process.env.FIREBASE_DATABASE_URL || functions.config().database_url.key,
});

exports.knowYourCustomerSearchCompany = require("./src/know-your-customer/searchCompany");

exports.duedillSearchCompany = require("./src/duedill/searchCompany");

exports.opencorporatesSearchCompany = require("./src/opencorporates/searchCompany");

exports.duedillCompanyShareholders = require("./src/duedill/requestCompanyShareholders");

exports.duedillCompanyVitals = require("./src/duedill/requestCompanyVitals");

exports.duedillCompanyIndustries = require("./src/duedill/requestCompanyIndustries");

exports.duedillCompanyPersonsOfSignificantControl = require("./src/duedill/requestCompanyPersonsOfSignificantControl");

exports.kyckrSearchCompany = require("./src/kyckr/searchCompany");

exports.kyckrCompanyProfile = require("./src/kyckr/requestCompanyProfile");

exports.kyckrFilingSearch = require("./src/kyckr/requestFilingSearch");

exports.kyckrProductOrder = require("./src/kyckr/requestProductOrder");

exports.kyckrProductList = require("./src/kyckr/requestProductList");

exports.kyckrCompanyOfficials = require("./src/kyckr/requestCompanyOfficials");

// exports.kyckrSaveCompanyStructure = require("./src/kyckr/saveCompanyStructure");

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

// generic 

exports.requestCompanyUBOStructure = require("./src/generic/requestCompanyUBOStructure");

exports.saveCompanyUBOStructure = require("./src/generic/saveCompanyUBOStructure");

exports.migrateCompanyStructure = require("./src/generic/migrateCompanyStructure");
exports.migratePersonStructure = require("./src/generic/migratePersonStructure");
exports.migrateRelationships = require("./src/generic/migrateRelationships");

// validation
exports.validateCompany = require("./src/validation/validateCompany");
exports.addRule = require("./src/validation/addRule");
exports.deleteAllRules = require("./src/validation/deleteAllRules");
exports.editField = require('./src/validation/editField');
exports.addUBO = require('./src/validation/addUBO');
exports.deleteUBO = require('./src/validation/deleteUBO');

// google
exports.googleFetchSheet = require("./src/google/fetchSheet");

exports.getIP = require("./src/generic/getIP");
exports.signIn = require("./src/generic/signIn");
exports.signInWithToken = require("./src/generic/signInWithToken");

// integrations 

exports.xeroAuthenticateCallback = require("./src/xero/authenticateCallback");
exports.xeroDisconnect = require("./src/xero/disconnect");
exports.xeroAuthenticate = require("./src/xero/authenticate");
exports.xeroGetInvoices = require("./src/xero/getInvoices");
exports.xeroAddBankAccount = require("./src/xero/addBankAccount");
exports.xeroGetBankAccounts = require("./src/xero/getBankAccounts");
exports.xeroDeleteBankAccount = require("./src/xero/deleteBankAccount");