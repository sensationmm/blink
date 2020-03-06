const primitiveValidation = require('./functionsPrimitive');

describe('equalTo()', () => {
    it('passes if equal', () => {
        const company = {
            example: 'yes'
        };

        const options = {
            search: 'example',
            match: 'yes'
        }

        const valid = primitiveValidation.equalTo(null, options, 'testField', company);

        expect(valid).toEqual(null);
    });

    it('fails if not equal', () => {
        const company = {
            example: 'no'
        };

        const options = {
            search: 'example',
            match: 'yes'
        }

        const valid = primitiveValidation.equalTo(null, options, 'testField', company);

        expect(valid).toEqual('equalTo fail');
    });
});

describe('notEqualTo()', () => {
    it('fails if equal', () => {
        const company = {
            example: 'yes'
        };

        const options = {
            search: 'example',
            match: 'yes'
        }

        const valid = primitiveValidation.notEqualTo(null, options, 'testField', company);

        expect(valid).toEqual('notEqualTo fail');
    });

    it('passes if not equal', () => {
        const company = {
            example: 'no'
        };

        const options = {
            search: 'example',
            match: 'yes'
        }

        const valid = primitiveValidation.notEqualTo(null, options, 'testField', company);

        expect(valid).toEqual(null);
    });
});

describe('greaterThan()', () => {
    it('passes if greater', () => {
        const company = {
            example: 20
        };

        const options = {
            search: 'example',
            match: 15
        }

        const valid = primitiveValidation.greaterThan(null, options, 'testField', company);

        expect(valid).toEqual(null);
    });
    it('passes if equal', () => {
        const company = {
            example: 15
        };

        const options = {
            search: 'example',
            match: 15
        }

        const valid = primitiveValidation.greaterThan(null, options, 'testField', company);

        expect(valid).toEqual(null);
    });

    it('fails if lesser', () => {
        const company = {
            example: 14
        };

        const options = {
            search: 'example',
            match: 15
        }

        const valid = primitiveValidation.greaterThan(null, options, 'testField', company);

        expect(valid).toEqual('greaterThan fail');
    });
});

describe('lessThan()', () => {
    it('fails if greater', () => {
        const company = {
            example: 20
        };

        const options = {
            search: 'example',
            match: 15
        }

        const valid = primitiveValidation.lessThan(null, options, 'testField', company);

        expect(valid).toEqual('lessThan fail');
    });

    it('fails if equal', () => {
        const company = {
            example: 15
        };

        const options = {
            search: 'example',
            match: 15
        }

        const valid = primitiveValidation.lessThan(null, options, 'testField', company);

        expect(valid).toEqual('lessThan fail');
    });

    it('passes if lesser', () => {
        const company = {
            example: 14
        };

        const options = {
            search: 'example',
            match: 15
        }

        const valid = primitiveValidation.lessThan(null, options, 'testField', company);

        expect(valid).toEqual(null);
    });
});
