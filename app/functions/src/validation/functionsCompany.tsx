export { }

const moment = require('moment');
const validateJS = require('validate.js');
const { fetchGoogleSheet } = require('../google/fetchSheet');

import { Value, Options, Key, Attributes } from './functionsGeneric';

type UBORequired = {
    required: boolean;
    for?: Array<string>;
}

/*
PLEASE NOTE
All functions MUST take the same four props as they are validateJS custom validators
(value, options, key, attributes, globalOptions)
*/

const requiresUBOChecks = (value: Value, options: Options, key: Key, attributes: Attributes, globalOptions: Options): UBORequired => {
    const { isPublic, distinctShareholders } = attributes;

    const majorityShareholder = distinctShareholders.filter((shareholder: any) => shareholder.totalShareholding > 50);

    if (isPublic === true || (
        majorityShareholder.length > 0 &&
        (
            majorityShareholder[0].shareholderType === 'C' &&
            majorityShareholder[0].isPublic === true &&
            majorityShareholder[0].citiCoveredExchange === true
        )
    )) {
        if (options.exceptions && options.exceptions.length > 0) {
            return { required: true, for: options.exceptions };
        }

        return { required: false };
    }

    return { required: true };
};

const parseDate = (value: string) => {
    // check to see if it looks like something close to a valid date
    if (moment(value).isValid()) {
        return value;
    }

    if (value) {
        const dateBits = value.split && value.split(/[-/]/);
        if (dateBits.length === 3) {
            const newDate = `${dateBits[1]}-${dateBits[0]}-${dateBits[2]}`
            return newDate;
        }
    }
    return value;
}

const ageLessThanThree = (value: Value, options: Options, key: Key, attributes: Attributes, globalOptions: Options) => {
    const undefinedYear = attributes.incorporationDate === undefined || attributes.incorporationDate === null || attributes.incorporationDate === '';
    const parsedDate = parseDate(attributes.incorporationDate);
    const younger = moment(parsedDate) > moment.utc().subtract(3, 'years');

    if ((undefinedYear || younger) && !validateJS.isDefined(value)) {
        return 'is required if incorporation is < 3yrs';
    } else {
        return null;
    }
}

const bearerSharesChecks = async (value: Value, options: Options, key: Key, attributes: Attributes, globalOptions: Options) => {

    const bearerInfo = await fetchGoogleSheet('1jg0qSvZLQQPHfL572BQKiHgolS91uyHFtznzX94OCrw');
    const bearerConfig = JSON.parse(bearerInfo).map((row: any) => {
        return { code: row['Alpha-2 code'], allowed: row['AllowBearerShares'], exception: row['CompanyTypeException'] }
    });

    const bearerSharesAllowed = (countryCode: string, type: string) => {
        const data = bearerConfig.filter((item: any) => item.code === countryCode);
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

// const naicsChecks = async (value: Value, options: Options, key: Key, attributes: Attributes, globalOptions: Options) => {
//     const { NAICSCode, SICCode } = attributes;

//     const naicsSheet = await fetchGoogleSheet('1K2dp6glyD6b0D7hTPBA_zFKjbqls0lrDbXoVra95dzo');
//     const naicsList = JSON.parse(naicsSheet).map((row: any) => {
//         return { code: row['NAICCode'], score: row['NAICScore'] }
//     });
//     if (!NAICSCode) {
//         if (!SICCode) {
//             return 'is required';
//         } else {

//         }
//     }

//     return null;
// };

const validationFunctions = {
    ageLessThanThree,
    bearerSharesChecks,
    // naicsChecks,
    requiresUBOChecks
};

module.exports = validationFunctions;
module.exports.parseDate = parseDate;
