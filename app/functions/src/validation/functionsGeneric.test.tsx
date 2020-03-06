const genericValidation = require('./functionsGeneric');

describe('requiredIfValueEquals()', () => {
    const options = {
        search: 'materialMergers',
        match: true,
    };

    it('pass if given and value matches', () => {
        const company = {
            materialMergerDetails: 'blah',
            materialMergers: true,
        };

        const valid = genericValidation.requiredIfValueEquals(company.materialMergerDetails, options, 'materialMergerDetails', company);

        expect(valid).toBe(null);
    });

    it('fail if given and value does not match', () => {
        const company = {
            materialMergerDetails: 'blah',
            materialMergers: false,
        };

        const valid = genericValidation.requiredIfValueEquals(company.materialMergerDetails, options, 'materialMergerDetails', company);

        expect(valid).toBe('cannot be supplied if material mergers is not true');
    });

    it('fail if not given and value matches', () => {
        const company = {
            materialMergers: true,
            materialMergerDetails: null,
        };

        const valid = genericValidation.requiredIfValueEquals(company.materialMergerDetails, options, 'materialMergerDetails', company);

        expect(valid).toBe('is required if material mergers is true');
    });

    it('pass if not given and value does not match', () => {
        const company = {
            materialMergers: false,
            materialMergerDetails: null,
        };

        const valid = genericValidation.requiredIfValueEquals(company.materialMergerDetails, options, 'materialMergerDetails', company);

        expect(valid).toBe(null);
    });

    it('error if `search` param not given', () => {
        const optionsError = {
            search: null,
            match: true,
        };

        const company = {
            materialMergerDetails: 'blah',
            materialMergers: true,
        };

        const valid = genericValidation.requiredIfValueEquals(company.materialMergerDetails, optionsError, 'materialMergerDetails', company);

        expect(valid).toBe(': ERROR requiredIfValueEquals.options.search not defined');
    });

    it('error if `find` param not given', () => {
        const optionsError = {
            search: 'materialMergers',
            match: null,
        };

        const company = {
            materialMergerDetails: 'blah',
            materialMergers: true,
        };

        const valid = genericValidation.requiredIfValueEquals(company.materialMergerDetails, optionsError, 'materialMergerDetails', company);

        expect(valid).toBe(': ERROR requiredIfValueEquals.options.match not defined');
    });
});

describe('requiredIf', () => {
    let options = { "presence": true, "type": "boolean" };

    describe('field not given', () => {
        it('should fail with passing validators', () => {
            const person = {
                countryOfResidence: "GB",
                totalShareholding: 30
            };

            options = { "greaterThan": { "search": "totalShareholding", "match": "25" }, "equalTo": { "search": "countryOfResidence", "match": "GB" } };

            const valid = genericValidation.requiredIf(null, options, 'checkField', person);

            expect(valid).toBe('is required');
        });

        it('should pass with mixed pass/fail validators', () => {
            const person = {
                countryOfResidence: "DE",
                totalShareholding: 30
            };

            options = { "greaterThan": { "search": "totalShareholding", "match": "25" }, "equalTo": { "search": "countryOfResidence", "match": "GB" } };

            const valid = genericValidation.requiredIf(null, options, 'checkField', person);

            expect(valid).toBe(null);
        });

        it('should pass with failing validators', () => {
            const person = {
                countryOfResidence: "DE",
                totalShareholding: 20
            };

            options = { "greaterThan": { "search": "totalShareholding", "match": "25" }, "equalTo": { "search": "countryOfResidence", "match": "GB" } };

            const valid = genericValidation.requiredIf(null, options, 'checkField', person);

            expect(valid).toBe(null);
        });
    });

    describe('field given', () => {
        it('should pass with passing validators', () => {
            const person = {
                checkField: 'given',
                countryOfResidence: "GB",
                totalShareholding: 30
            };

            options = { "greaterThan": { "search": "totalShareholding", "match": "25" }, "equalTo": { "search": "countryOfResidence", "match": "GB" } };

            const valid = genericValidation.requiredIf(null, options, 'checkField', person);

            expect(valid).toBe(null);
        });

        it('should pass with mixed pass/fail validators', () => {
            const person = {
                checkField: 'given',
                countryOfResidence: "DE",
                totalShareholding: 30
            };

            options = { "greaterThan": { "search": "totalShareholding", "match": "25" }, "equalTo": { "search": "countryOfResidence", "match": "GB" } };

            const valid = genericValidation.requiredIf(null, options, 'checkField', person);

            expect(valid).toBe(null);
        });

        it('should pass with failing validators', () => {
            const person = {
                checkField: 'given',
                countryOfResidence: "DE",
                totalShareholding: 20
            };

            options = { "greaterThan": { "search": "totalShareholding", "match": "25" }, "equalTo": { "search": "countryOfResidence", "match": "GB" } };

            const valid = genericValidation.requiredIf(null, options, 'checkField', person);

            expect(valid).toBe(null);
        });
    });
});
