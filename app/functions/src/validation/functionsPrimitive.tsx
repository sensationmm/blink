export { }

import { Value, Options, Key, Attributes } from './functionsGeneric';

/**
 * Checks if a specified parameter matches a specified value
 * <pre>{ "equalTo": {"search": "countryOfTaxResidence", "match": "IT" }}</pre>
 * Will look for a field `countryOfTaxResidence` on the object being validated and pass if the value is `IT`
 * @param {string} search - attribute to compare
 * @param {any} match - value to compare with
 * @return {null|string} - returns null if success, `equalTo fail` if failure
 */
const equalTo = (value: Value, { search, match }: Options, key: Key, attributes: Attributes) => {
    if (attributes[search] === match) {
        return null;
    };

    return 'equalTo fail';
};

/**
 * Checks if a specified parameter does not match a specified value
 * <pre>{ "notEqualTo": {"search": "countryOfTaxResidence", "match": "IT" }}</pre>
 * Will look for a field `countryOfTaxResidence` on the object being validated and fail if the value is `IT`
 * @param {string} search - attribute to compare
 * @param {any} match - value to compare with
 * @return {null|string} - returns null if success, `notEqualTo fail` if failure
 */
const notEqualTo = (value: Value, { search, match }: Options, key: Key, attributes: Attributes) => {
    if (attributes[search] !== match) {
        return null;
    };

    return 'notEqualTo fail';
};

/**
 * Checks if a specified parameter is greater than a specified value
 * <pre>{ "greaterThan": {"search": "age", "match": 23 }}</pre>
 * Will look for a field `age` on the object being validated and pass if the value is greater than or equal to `23`
 * @param {string} search - attribute to compare
 * @param {number} match - value to compare with
 * @return {null|string} - returns null if success, `greaterThan fail` if failure
 */
const greaterThan = (value: Value, { search, match }: Options, key: Key, attributes: Attributes) => {
    if (attributes[search] >= match) {
        return null;
    };

    return 'greaterThan fail';

};

/**
 * Checks if a specified parameter is less than a specified value
 * <pre>{ "lessThan": {"search": "age", "match": 23 }}</pre>
 * Will look for a field `age` on the object being validated and pass if the value is less than `23`
 * @param {string} search - attribute to compare
 * @param {number} match - value to compare with
 * @return {null|string} - returns null if success, `lessThan fail` if failure
 */
const lessThan = (value: Value, { search, match }: Options, key: Key, attributes: Attributes) => {
    if (attributes[search] < match) {
        return null;
    };

    return 'lessThan fail';
};

module.exports = {
    equalTo,
    notEqualTo,
    greaterThan,
    lessThan
};
