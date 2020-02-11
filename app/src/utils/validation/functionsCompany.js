const moment = require('moment');
const validateJS = require('validate.js');
const { GoogleSpreadsheet } = require('google-spreadsheet');

const fetchGoogleSheet = async (sheetID) => {
    const doc = new GoogleSpreadsheet(sheetID);
    await doc.useServiceAccountAuth({
        client_email: process.env.APP_GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: process.env.APP_GOOGLE_PRIVATE_KEY,
    });

    await doc.loadInfo();

    const sheet = doc.sheetsByIndex[0].getRows();

    return sheet;
}

/*
PLEASE NOTE
All functions MUST take the same four props as they are validateJS custom validators
(value, options, key, attributes)
*/

const ageLessThanThree = (value, options, key, attributes) => {
    const undefinedYear = attributes.incorporationDate === undefined || attributes.incorporationDate === null || attributes.incorporationDate === '';
    const younger = new Date(attributes.incorporationDate) > new Date(moment.utc().subtract(3, 'years'));

    if ((undefinedYear || younger) && !validateJS.isDefined(value)) {
        return 'is required if incorporation is < 3yrs';
    } else {
        return null;
    }
}

const bearerSharesChecks = async (value, options, key, attributes) => {
    const bearerInfo = await fetchGoogleSheet('1jg0qSvZLQQPHfL572BQKiHgolS91uyHFtznzX94OCrw');
    const bearerConfig = bearerInfo.map(row => {
        return { code: row['Alpha-2 code'], allowed: row['AllowBearerShares'], exception: row['CompanyTypeException'] }
    });

    const bearerSharesAllowed = (countryCode, type) => {
        const data = bearerConfig.filter(item => item.code === countryCode);
        const allowed = data[0]
            ? data[0].allowed === 'Y' || (type === data[0].exception || (Array.isArray(data[0].exception) && data[0].exception.indexOf(type) > -1))
            : false;

        return allowed;
    }

    const {
        countryCode,
        type,
        companyAllowsBearerShares,
        bearerSharesOutstanding,
        bearerShareEvidenceLink,
        bearerShareClientAttestation,
        bearerShareRiskMitigationMethod
    } = attributes;
    let failedOn;

    if (bearerSharesAllowed(countryCode, type)) {
        if (!companyAllowsBearerShares) {
            if (!validateJS.isDefined(bearerShareEvidenceLink)) {
                failedOn = 'bearerShareEvidenceLink';
            }
        } else {
            if (bearerSharesOutstanding > 10) {
                if (!validateJS.isDefined(bearerShareRiskMitigationMethod)) {
                    failedOn = 'bearerShareRiskMitigationMethod';
                }
            } else {
                if (!validateJS.isDefined(bearerShareClientAttestation)) {
                    failedOn = 'bearerShareClientAttestation';
                }
            }
        }
    }

    if (failedOn === key) {
        return 'is required';
    }

    return null;
};

const requiredIfValueEquals = (value, { search, match }, key, attributes) => {
    if (!search) {
        return ': ERROR requiredIfValueEquals.options.search not defined';
    }
    if (!match) {
        return ': ERROR requiredIfValueEquals.options.match not defined';
    }

    if (attributes[search] === match) {
        if (validateJS.isDefined(value)) {
            return null;
        }

        return `is required if ${validateJS.prettify(search)} is ${match}`;
    } else {
        if (validateJS.isDefined(value)) {
            return `cannot be supplied if ${validateJS.prettify(search)} is not ${match}`;
        }

        return null;
    }
}

const validationFunctions = {
    ageLessThanThree,
    bearerSharesChecks,
    requiredIfValueEquals,
};

module.exports = validationFunctions;