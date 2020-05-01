export { }

const validateJS = require('validate.js');

export type Value = any;
export type Options = { [key: string]: any };
export type Key = string;
export type Attributes = { [key: string]: any };

// Helper function to check for existence of nested key
const propertyExists = (attributes: Attributes, key: string) => {
    while(key.indexOf('.') > 0) {
        let parts = key.split(/\.(.+)/);
        if(attributes.hasOwnProperty(parts[0])){
            attributes = attributes[parts[0]];
            key = parts[1];
        }
        else 
            return false;
    }
    return attributes.hasOwnProperty(key);
}

// Helper function to extract underlying value from nested keys
const getAttributeValue = (attributes: Attributes, search: string) => {
    while(search.indexOf('.') > 0 && attributes !== undefined)
    {
        let parts = search.split(/\.(.+)/);
        attributes = attributes[parts[0]];
        search = parts[1];
    }
    if (attributes === undefined) return '';
    else return attributes[search];
}

const requiredIfValueEquals = (value: Value, { search, match }: Options, key: Key, attributes: Attributes, globalOptions: Options) => {
    if (!search) {
        return ': ERROR requiredIfValueEquals.options.search not defined';
    }
    if (!match) {
        return ': ERROR requiredIfValueEquals.options.match not defined';
    }

    if (getAttributeValue(attributes,search) === match) {
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

/**
 * Makes a field required if given conditions are true
 * <pre>{ "requiredIf": conditions }</pre>
 * @param {object} conditions - validation function list
 * @return {null|string} - returns null if validations are false, `is required` if validations are true
 */
const requiredIf = (value: Value, options: Options, key: Key, attributes: Attributes) => {
    const valid = validateJS.validate(attributes, { [key]: options });

    if ((valid === 'undefined' || valid === undefined) && !propertyExists(attributes, key)) {
        return 'is required';
    }

    return null;
};

/**
 * Makes a field match a value if given conditions are true
 * <pre>{ "requiredValueIf": {value, conditions} }</pre>
 * @param {any} value - value required
 * @param {object} conditions - validation function list
 * @return {null|string} - returns null if validations are false, `must be {value}` if validations are true
 */
const requiredValueIf = (value: Value, options: Options, key: Key, attributes: Attributes) => {
    const valid = validateJS.validate(attributes, { [key]: options.conditions });

    if ((valid === 'undefined' || valid === undefined) && value !== options.value) {
        return `must be ${options.value}`;
    }

    return null;
};

/**
 * Makes a field required if one or more of a given set of conditions is true
 * <pre>{ "requiredIfOne": { scenarios: [conditions1, conditions2, {...rest}] }}</pre>
 * @param {array<object>} scenarios - x number of validation function list combinations
 * @return {null|string} - returns null if no validation sets match, `is required` if one or more match
 */
const requiredIfOne = (value: Value, options: Options, key: Key, attributes: Attributes) => {
    const scenarios = options.scenarios;

    if (!Array.isArray(scenarios)) {
        return ': ERROR options must contain `scenarios` array';
    }

    let required = false;

    scenarios.forEach((scenario: any) => {
        const valid = requiredIf(value, scenario, key, attributes);

        if (valid === 'is required') {
            required = true;
        }
    });

    if (required) {
        return 'is required';
    }

    return null;
}

/**
 * Makes a field match a value if one or more of a given set of conditions is true
 * <pre>{ "requiredValueIfOne": { value, scenarios: [conditions1, conditions2, {...rest}] }}</pre>
 * @param {any} value - value required
 * @param {array<object>} scenarios - x number of validation function list combinations
 * @return {null|string} - returns null if no validation sets match, `is required` if one or more match
 */
const requiredValueIfOne = (value: Value, options: Options, key: Key, attributes: Attributes) => {
    const scenarios = options.scenarios;

    if (!Array.isArray(scenarios)) {
        return ': ERROR options must contain `scenarios` array';
    }

    if (!options.value) {
        return ': ERROR options must contain required `value`';
    }

    let required = false;

    scenarios.forEach((scenario: any) => {
        const valid = requiredValueIf(value, { value: options.value, conditions: scenario }, key, attributes);

        if (valid === `must be ${options.value}`) {
            required = true;
        }
    });

    if (required) {
        return `must be ${options.value}`;
    }

    return null;
}

const validationFunctions = {
    requiredIfValueEquals,
    requiredIf,
    requiredValueIf,
    requiredIfOne,
    requiredValueIfOne
};

module.exports = validationFunctions;

const primitiveValidation = require('./functionsPrimitive');

const customValidationKeys = Object.keys(primitiveValidation);
customValidationKeys.forEach((key) => {
    validateJS.validate.validators[key] = primitiveValidation[key];
});
