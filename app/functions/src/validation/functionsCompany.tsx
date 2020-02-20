export { }

const moment = require('moment');
const validateJS = require('validate.js');
const { fetchGoogleSheet } = require('../google/fetchSheet');

type Value = any;
type Options = { [key: string]: any };
type Key = string;
type Attributes = { [key: string]: any };

/*
PLEASE NOTE
All functions MUST take the same four props as they are validateJS custom validators
(value, options, key, attributes)
*/

const ageLessThanThree = (value: Value, options: Options, key: Key, attributes: Attributes) => {
    const undefinedYear = attributes.incorporationDate === undefined || attributes.incorporationDate === null || attributes.incorporationDate === '';
    const younger = moment(attributes.incorporationDate) > moment.utc().subtract(3, 'years');

    if ((undefinedYear || younger) && !validateJS.isDefined(value)) {
        return 'is required if incorporation is < 3yrs';
    } else {
        return null;
    }
}

const bearerSharesChecks = /*async*/ (value: Value, options: Options, key: Key, attributes: Attributes) => {
    return null;
    // const bearerInfo = await fetchGoogleSheet('1jg0qSvZLQQPHfL572BQKiHgolS91uyHFtznzX94OCrw');
    // const bearerConfig = JSON.parse(bearerInfo).map((row: any) => {
    //     return { code: row['Alpha-2 code'], allowed: row['AllowBearerShares'], exception: row['CompanyTypeException'] }
    // });

    // const bearerSharesAllowed = (countryCode: string, type: string) => {
    //     const data = bearerConfig.filter((item: any) => item.code === countryCode);
    //     const allowed = data[0]
    //         ? data[0].allowed === 'Y' || (type === data[0].exception || (Array.isArray(data[0].exception) && data[0].exception.indexOf(type) > -1))
    //         : false;

    //     return allowed;
    // }

    // const {
    //     countryCode,
    //     type,
    //     companyAllowsBearerShares,
    //     bearerSharesOutstanding,
    //     bearerShareEvidenceLink,
    //     bearerShareClientAttestation,
    //     bearerShareRiskMitigationMethod
    // } = attributes;
    // let failedOn;

    // if (bearerSharesAllowed(countryCode, type)) {
    //     if (!companyAllowsBearerShares) {
    //         if (!validateJS.isDefined(bearerShareEvidenceLink)) {
    //             failedOn = 'bearerShareEvidenceLink';
    //         }
    //     } else {
    //         if (bearerSharesOutstanding > 10) {
    //             if (!validateJS.isDefined(bearerShareRiskMitigationMethod)) {
    //                 failedOn = 'bearerShareRiskMitigationMethod';
    //             }
    //         } else {
    //             if (!validateJS.isDefined(bearerShareClientAttestation)) {
    //                 failedOn = 'bearerShareClientAttestation';
    //             }
    //         }
    //     }
    // }

    // if (failedOn === key) {
    //     return 'is required';
    // }

    // return null;
};

const requiredIfValueEquals = (value: Value, { search, match }: Options, key: Key, attributes: Attributes) => {
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

const naicsChecks = async (value: Value, options: Options, key: Key, attributes: Attributes) => {
    // const { NAICSCode, SICCode } = attributes;

    // const naicsSheet = await fetchGoogleSheet('1K2dp6glyD6b0D7hTPBA_zFKjbqls0lrDbXoVra95dzo');
    // const naicsList = JSON.parse(naicsSheet).map((row: any) => {
    //     return { code: row['NAICCode'], score: row['NAICScore'] }
    // });
    // if (!NAICSCode) {
    //     if (!SICCode) {
    //         return 'is required';
    //     } else {

    //     }
    // }

    return null;
};

const validationFunctions = {
    ageLessThanThree,
    bearerSharesChecks,
    naicsChecks,
    requiredIfValueEquals,
};

module.exports = validationFunctions;
