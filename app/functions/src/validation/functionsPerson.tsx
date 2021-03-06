export { }

import { Value, Key, Attributes } from './functionsGeneric';

/*
PLEASE NOTE
All functions MUST take the same four props as they are validateJS custom validators
(value, options, key, attributes)
*/

const shareholdingGreaterThan = (value: Value, options: string, key: Key, attributes: Attributes) => {
    let threshold = parseFloat(options);
    let shareholding = attributes.totalShareholding;

    if (shareholding >= threshold && !attributes.hasOwnProperty(key)) {
        return 'is required if shareholding > ' + threshold + '%';
    }

    return null;
};

const validationFunctions = {
    shareholdingGreaterThan,
};

module.exports = validationFunctions;
