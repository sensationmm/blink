export { }

import { Value, Options, Key, Attributes } from './functionsGeneric';

const equalTo = (value: Value, { search, match }: Options, key: Key, attributes: Attributes) => {
    if (attributes[search] === match) {
        return null;
    };

    return 'equalTo fail';
};

const notEqualTo = (value: Value, { search, match }: Options, key: Key, attributes: Attributes) => {
    if (attributes[search] !== match) {
        return null;
    };

    return 'notEqualTo fail';
};

const greaterThan = (value: Value, { search, match }: Options, key: Key, attributes: Attributes) => {
    if (attributes[search] >= match) {
        return null;
    };

    return 'greaterThan fail';

};

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
