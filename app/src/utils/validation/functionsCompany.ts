import moment from 'moment';
import validateJS from 'validate.js';
import { fetchGoogleSheet } from '../google';

/*
PLEASE NOTE
All functions MUST take the same four props as they are validateJS custom validators
(value, options, key, attributes)
*/

const ageLessThanThree = (value: string | null, options: object, key: string, attributes: { [key: string]: any }): string | null => {
    const undefinedYear = attributes.incorporationDate === undefined || attributes.incorporationDate === null || attributes.incorporationDate === '';
    const younger = moment(attributes.incorporationDate) > moment.utc().subtract(3, 'years');

    if ((undefinedYear || younger) && !validateJS.isDefined(value)) {
        return 'is required if incorporation is < 3yrs';
    } else {
        return null;
    }
}

const bearerSharesChecks = async (value: string | null, options: object, key: string, attributes: { [key: string]: any }): Promise<string | null> => {
    const bearerInfo = await fetchGoogleSheet('1jg0qSvZLQQPHfL572BQKiHgolS91uyHFtznzX94OCrw');
    const bearerConfig = bearerInfo.map((row: any) => {
        return { code: row['Alpha-2 code'], allowed: row['AllowBearerShares'], exception: row['CompanyTypeException'] }
    });

    const bearerSharesAllowed = (countryCode: string, type: string | Array<string>) => {
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

const requiredIfValueEquals = (value: string | null, { search, match }: { [key: string]: any }, key: string, attributes: { [key: string]: any }): string | null => {
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

export default validationFunctions;
