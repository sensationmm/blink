export { }

const validateJS = require('validate.js');

export type Value = any;
export type Options = { [key: string]: any };
export type Key = string;
export type Attributes = { [key: string]: any };

const requiredIfValueEquals = (value: Value, { search, match }: Options, key: Key, attributes: Attributes, globalOptions: Options) => {
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

const requiredIf = (value: Value, options: Options, key: Key, attributes: Attributes) => {
    const valid = validateJS.validate(attributes, { [key]: options });

    if ((valid === 'undefined' || valid === undefined) && !attributes.hasOwnProperty(key)) {
        return 'is required';
    }

    return null;
};

const validationFunctions = {
    requiredIfValueEquals,
    requiredIf
};

module.exports = validationFunctions;

const primitiveValidation = require('./functionsPrimitive');

const customValidationKeys = Object.keys(primitiveValidation);
customValidationKeys.forEach((key) => {
    validateJS.validate.validators[key] = primitiveValidation[key];
});
