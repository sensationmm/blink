const genericValidation = require('./functionsGeneric');

describe('requiredIfValueEquals()', () => {
    let options = {
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
    describe('field not given', () => {
        it('should fail with passing validators', () => {
            const person = {
                countryOfResidence: "GB",
                totalShareholding: 30
            };

            const options = { "greaterThan": { "search": "totalShareholding", "match": "25" }, "equalTo": { "search": "countryOfResidence", "match": "GB" } };

            const valid = genericValidation.requiredIf(null, options, 'checkField', person);

            expect(valid).toBe('is required');
        });

        it('should pass with mixed pass/fail validators', () => {
            const person = {
                countryOfResidence: "DE",
                totalShareholding: 30
            };

            const options = { "greaterThan": { "search": "totalShareholding", "match": "25" }, "equalTo": { "search": "countryOfResidence", "match": "GB" } };

            const valid = genericValidation.requiredIf(null, options, 'checkField', person);

            expect(valid).toBe(null);
        });

        it('should pass with failing validators', () => {
            const person = {
                countryOfResidence: "DE",
                totalShareholding: 20
            };

            const options = { "greaterThan": { "search": "totalShareholding", "match": "25" }, "equalTo": { "search": "countryOfResidence", "match": "GB" } };

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

            const options = { "greaterThan": { "search": "totalShareholding", "match": "25" }, "equalTo": { "search": "countryOfResidence", "match": "GB" } };

            const valid = genericValidation.requiredIf(null, options, 'checkField', person);

            expect(valid).toBe(null);
        });

        it('should pass with mixed pass/fail validators', () => {
            const person = {
                checkField: 'given',
                countryOfResidence: "DE",
                totalShareholding: 30
            };

            const options = { "greaterThan": { "search": "totalShareholding", "match": "25" }, "equalTo": { "search": "countryOfResidence", "match": "GB" } };

            const valid = genericValidation.requiredIf(null, options, 'checkField', person);

            expect(valid).toBe(null);
        });

        it('should pass with failing validators', () => {
            const person = {
                checkField: 'given',
                countryOfResidence: "DE",
                totalShareholding: 20
            };

            const options = { "greaterThan": { "search": "totalShareholding", "match": "25" }, "equalTo": { "search": "countryOfResidence", "match": "GB" } };

            const valid = genericValidation.requiredIf(null, options, 'checkField', person);

            expect(valid).toBe(null);
        });
    });
});

describe('requiredValueIf', () => {
    describe('field not given', () => {
        it('should fail with passing validators', () => {
            const person = {
                countryOfResidence: "GB",
                totalShareholding: 30
            };

            const options = {
                value: 'given',
                conditions: { "greaterThan": { "search": "totalShareholding", "match": "25" }, "equalTo": { "search": "countryOfResidence", "match": "GB" } }
            };

            const valid = genericValidation.requiredValueIf(null, options, 'checkField', person);

            expect(valid).toBe(`must be ${options.value}`);
        });

        it('should pass with mixed pass/fail validators', () => {
            const person = {
                countryOfResidence: "DE",
                totalShareholding: 30
            };

            const options = {
                value: 'given',
                conditions: { "greaterThan": { "search": "totalShareholding", "match": "25" }, "equalTo": { "search": "countryOfResidence", "match": "GB" } }
            };

            const valid = genericValidation.requiredValueIf(null, options, 'checkField', person);

            expect(valid).toBe(null);
        });

        it('should pass with failing validators', () => {
            const person = {
                countryOfResidence: "DE",
                totalShareholding: 20
            };

            const options = {
                value: 'given',
                conditions: { "greaterThan": { "search": "totalShareholding", "match": "25" }, "equalTo": { "search": "countryOfResidence", "match": "GB" } }
            };

            const valid = genericValidation.requiredValueIf(null, options, 'checkField', person);

            expect(valid).toBe(null);
        });
    });

    describe('field given incorrect', () => {
        it('should fail with passing validators', () => {
            const person = {
                checkField: 'notgiven',
                countryOfResidence: "GB",
                totalShareholding: 30
            };

            const options = {
                value: 'given',
                conditions: { "greaterThan": { "search": "totalShareholding", "match": "25" }, "equalTo": { "search": "countryOfResidence", "match": "GB" } }
            };

            const valid = genericValidation.requiredValueIf(person.checkField, options, 'checkField', person);

            expect(valid).toBe(`must be ${options.value}`);
        });

        it('should pass with mixed pass/fail validators', () => {
            const person = {
                checkField: 'notgiven',
                countryOfResidence: "DE",
                totalShareholding: 30
            };

            const options = {
                value: 'given',
                conditions: { "greaterThan": { "search": "totalShareholding", "match": "25" }, "equalTo": { "search": "countryOfResidence", "match": "GB" } }
            };

            const valid = genericValidation.requiredValueIf(person.checkField, options, 'checkField', person);

            expect(valid).toBe(null);
        });

        it('should pass with failing validators', () => {
            const person = {
                checkField: 'notgiven',
                countryOfResidence: "DE",
                totalShareholding: 20
            };

            const options = {
                value: 'given',
                conditions: { "greaterThan": { "search": "totalShareholding", "match": "25" }, "equalTo": { "search": "countryOfResidence", "match": "GB" } }
            };

            const valid = genericValidation.requiredValueIf(person.checkField, options, 'checkField', person);

            expect(valid).toBe(null);
        });
    });

    describe('field given correct', () => {
        it('should pass with passing validators', () => {
            const person = {
                checkField: 'given',
                countryOfResidence: "GB",
                totalShareholding: 30
            };

            const options = {
                value: 'given',
                conditions: { "greaterThan": { "search": "totalShareholding", "match": "25" }, "equalTo": { "search": "countryOfResidence", "match": "GB" } }
            };

            const valid = genericValidation.requiredValueIf(person.checkField, options, 'checkField', person);

            expect(valid).toBe(null);
        });

        it('should pass with mixed pass/fail validators', () => {
            const person = {
                checkField: 'given',
                countryOfResidence: "DE",
                totalShareholding: 30
            };

            const options = {
                value: 'given',
                conditions: { "greaterThan": { "search": "totalShareholding", "match": "25" }, "equalTo": { "search": "countryOfResidence", "match": "GB" } }
            };

            const valid = genericValidation.requiredValueIf(person.checkField, options, 'checkField', person);

            expect(valid).toBe(null);
        });

        it('should pass with failing validators', () => {
            const person = {
                checkField: 'given',
                countryOfResidence: "DE",
                totalShareholding: 20
            };

            const options = {
                value: 'given',
                conditions: { "greaterThan": { "search": "totalShareholding", "match": "25" }, "equalTo": { "search": "countryOfResidence", "match": "GB" } }
            };

            const valid = genericValidation.requiredValueIf(person.checkField, options, 'checkField', person);

            expect(valid).toBe(null);
        });
    });
});

describe('requiredIfOne', () => {

    describe('field not given', () => {
        it('errors with incorrect structure', () => {
            const person = {
                countryOfResidence: "GB",
                totalShareholding: 30
            };

            const options = { "greaterThan": { "search": "totalShareholding", "match": "25" }, "equalTo": { "search": "countryOfResidence", "match": "GB" } };

            const valid = genericValidation.requiredIfOne(null, options, 'checkField', person);

            expect(valid).toBe(': ERROR options must contain `scenarios` array');
        });

        it('should fail with all passing validators', () => {
            const person = {
                countryOfResidence: "GB",
                totalShareholding: 30,
                highRisk: 'no'
            };

            const options = {
                "scenarios": [
                    { "greaterThan": { "search": "totalShareholding", "match": "25" }, "equalTo": { "search": "countryOfResidence", "match": "GB" } },
                    { "notEqualTo": { "search": "highRisk", "match": "yes" } }
                ]
            };

            const valid = genericValidation.requiredIfOne(null, options, 'checkField', person);

            expect(valid).toBe('is required');
        });

        it('should fail with some passing validators', () => {
            const person = {
                countryOfResidence: "GB",
                totalShareholding: 30,
                highRisk: 'yes'
            };

            const options = {
                "scenarios": [
                    { "greaterThan": { "search": "totalShareholding", "match": "25" }, "equalTo": { "search": "countryOfResidence", "match": "GB" } },
                    { "notEqualTo": { "search": "highRisk", "match": "yes" } }
                ]
            };

            const valid = genericValidation.requiredIfOne(null, options, 'checkField', person);

            expect(valid).toBe('is required');
        });

        it('should pass with all failing validators', () => {
            const person = {
                countryOfResidence: "IT",
                totalShareholding: 20,
                highRisk: 'yes'
            };

            const options = {
                "scenarios": [
                    { "greaterThan": { "search": "totalShareholding", "match": "25" }, "equalTo": { "search": "countryOfResidence", "match": "GB" } },
                    { "notEqualTo": { "search": "highRisk", "match": "yes" } }
                ]
            };

            const valid = genericValidation.requiredIfOne(null, options, 'checkField', person);

            expect(valid).toBe(null);
        });
    });

    describe('field given', () => {
        it('errors with incorrect structure', () => {
            const person = {
                checkField: 'given',
                countryOfResidence: "GB",
                totalShareholding: 30
            };

            const options = { "greaterThan": { "search": "totalShareholding", "match": "25" }, "equalTo": { "search": "countryOfResidence", "match": "GB" } };

            const valid = genericValidation.requiredIfOne(null, options, 'checkField', person);

            expect(valid).toBe(': ERROR options must contain `scenarios` array');
        });

        it('should pass with all passing validators', () => {
            const person = {
                checkField: 'given',
                countryOfResidence: "GB",
                totalShareholding: 30,
                highRisk: 'no'
            };

            const options = {
                "scenarios": [
                    { "greaterThan": { "search": "totalShareholding", "match": "25" }, "equalTo": { "search": "countryOfResidence", "match": "GB" } },
                    { "notEqualTo": { "search": "highRisk", "match": "yes" } }
                ]
            };

            const valid = genericValidation.requiredIfOne(null, options, 'checkField', person);

            expect(valid).toBe(null);
        });

        it('should pass with some passing validators', () => {
            const person = {
                checkField: 'given',
                countryOfResidence: "GB",
                totalShareholding: 30,
                highRisk: 'yes'
            };

            const options = {
                "scenarios": [
                    { "greaterThan": { "search": "totalShareholding", "match": "25" }, "equalTo": { "search": "countryOfResidence", "match": "GB" } },
                    { "notEqualTo": { "search": "highRisk", "match": "yes" } }
                ]
            };

            const valid = genericValidation.requiredIfOne(null, options, 'checkField', person);

            expect(valid).toBe(null);
        });

        it('should pass with all failing validators', () => {
            const person = {
                checkField: 'given',
                countryOfResidence: "IT",
                totalShareholding: 20,
                highRisk: 'yes'
            };

            const options = {
                "scenarios": [
                    { "greaterThan": { "search": "totalShareholding", "match": "25" }, "equalTo": { "search": "countryOfResidence", "match": "GB" } },
                    { "notEqualTo": { "search": "highRisk", "match": "yes" } }
                ]
            };

            const valid = genericValidation.requiredIfOne(null, options, 'checkField', person);

            expect(valid).toBe(null);
        });
    });
});

describe('requiredValueIfOne', () => {
    describe('field not given', () => {
        it('errors with missing value', () => {
            const person = {
                countryOfResidence: "GB",
                totalShareholding: 30,
                highRisk: 'no',
            };

            const options = {
                scenarios: [
                    { "greaterThan": { "search": "totalShareholding", "match": "25" }, "equalTo": { "search": "countryOfResidence", "match": "GB" } },
                    { "notEqualTo": { "search": "highRisk", "match": "yes" } }
                ]
            };

            const valid = genericValidation.requiredValueIfOne(null, options, 'checkField', person);

            expect(valid).toBe(': ERROR options must contain required `value`');
        });

        it('errors with incorrect structure', () => {
            const person = {
                countryOfResidence: "GB",
                totalShareholding: 30,
                highRisk: 'no',
            };

            const options = {
                value: 'given',
                scenarios: { "greaterThan": { "search": "totalShareholding", "match": "25" }, "equalTo": { "search": "countryOfResidence", "match": "GB" } }
            };

            const valid = genericValidation.requiredValueIfOne(null, options, 'checkField', person);

            expect(valid).toBe(': ERROR options must contain `scenarios` array');
        });

        it('should fail with passing validators', () => {
            const person = {
                countryOfResidence: "GB",
                totalShareholding: 30,
                highRisk: 'no',
            };

            const options = {
                value: 'given',
                scenarios: [
                    { "greaterThan": { "search": "totalShareholding", "match": "25" }, "equalTo": { "search": "countryOfResidence", "match": "GB" } },
                    { "notEqualTo": { "search": "highRisk", "match": "yes" } }
                ]
            };

            const valid = genericValidation.requiredValueIfOne(null, options, 'checkField', person);

            expect(valid).toBe(`must be ${options.value}`);
        });

        it('should fail with mixed pass/fail validators', () => {
            const person = {
                countryOfResidence: "DE",
                totalShareholding: 30,
                highRisk: 'no',
            };

            const options = {
                value: 'given',
                scenarios: [
                    { "greaterThan": { "search": "totalShareholding", "match": "25" }, "equalTo": { "search": "countryOfResidence", "match": "GB" } },
                    { "notEqualTo": { "search": "highRisk", "match": "yes" } }
                ]
            };

            const valid = genericValidation.requiredValueIfOne(null, options, 'checkField', person);

            expect(valid).toBe(`must be ${options.value}`);
        });

        it('should pass with failing validators', () => {
            const person = {
                countryOfResidence: "DE",
                totalShareholding: 20,
                highRisk: 'yes',
            };

            const options = {
                value: 'given',
                scenarios: [
                    { "greaterThan": { "search": "totalShareholding", "match": "25" }, "equalTo": { "search": "countryOfResidence", "match": "GB" } },
                    { "notEqualTo": { "search": "highRisk", "match": "yes" } }
                ]
            };

            const valid = genericValidation.requiredValueIfOne(null, options, 'checkField', person);

            expect(valid).toBe(null);
        });
    });

    describe('field given incorrect', () => {
        it('errors with missing value', () => {
            const person = {
                checkField: 'notgiven',
                countryOfResidence: "GB",
                totalShareholding: 30,
                highRisk: 'no',
            };

            const options = {
                scenarios: [
                    { "greaterThan": { "search": "totalShareholding", "match": "25" }, "equalTo": { "search": "countryOfResidence", "match": "GB" } },
                    { "notEqualTo": { "search": "highRisk", "match": "yes" } }
                ]
            };

            const valid = genericValidation.requiredValueIfOne(null, options, 'checkField', person);

            expect(valid).toBe(': ERROR options must contain required `value`');
        });

        it('errors with incorrect structure', () => {
            const person = {
                checkField: 'notgiven',
                countryOfResidence: "GB",
                totalShareholding: 30,
                highRisk: 'no',
            };

            const options = {
                value: 'given',
                scenarios: { "greaterThan": { "search": "totalShareholding", "match": "25" }, "equalTo": { "search": "countryOfResidence", "match": "GB" } }
            };

            const valid = genericValidation.requiredValueIfOne(null, options, 'checkField', person);

            expect(valid).toBe(': ERROR options must contain `scenarios` array');
        });

        it('should fail with passing validators', () => {
            const person = {
                checkField: 'notgiven',
                countryOfResidence: "GB",
                totalShareholding: 30,
                highRisk: 'no',
            };

            const options = {
                value: 'given',
                scenarios: [
                    { "greaterThan": { "search": "totalShareholding", "match": "25" }, "equalTo": { "search": "countryOfResidence", "match": "GB" } },
                    { "notEqualTo": { "search": "highRisk", "match": "yes" } }
                ]
            };

            const valid = genericValidation.requiredValueIfOne(person.checkField, options, 'checkField', person);

            expect(valid).toBe(`must be ${options.value}`);
        });

        it('should fail with mixed pass/fail validators', () => {
            const person = {
                checkField: 'notgiven',
                countryOfResidence: "DE",
                totalShareholding: 30,
                highRisk: 'no',
            };

            const options = {
                value: 'given',
                scenarios: [
                    { "greaterThan": { "search": "totalShareholding", "match": "25" }, "equalTo": { "search": "countryOfResidence", "match": "GB" } },
                    { "notEqualTo": { "search": "highRisk", "match": "yes" } }
                ]
            };

            const valid = genericValidation.requiredValueIfOne(person.checkField, options, 'checkField', person);

            expect(valid).toBe(`must be ${options.value}`);
        });

        it('should pass with failing validators', () => {
            const person = {
                checkField: 'notgiven',
                countryOfResidence: "DE",
                totalShareholding: 20,
                highRisk: 'yes',
            };

            const options = {
                value: 'given',
                scenarios: [
                    { "greaterThan": { "search": "totalShareholding", "match": "25" }, "equalTo": { "search": "countryOfResidence", "match": "GB" } },
                    { "notEqualTo": { "search": "highRisk", "match": "yes" } }
                ]
            };

            const valid = genericValidation.requiredValueIfOne(person.checkField, options, 'checkField', person);

            expect(valid).toBe(null);
        });
    });

    describe('field given correct', () => {
        it('errors with missing value', () => {
            const person = {
                checkField: 'given',
                countryOfResidence: "GB",
                totalShareholding: 30,
                highRisk: 'no',
            };

            const options = {
                scenarios: [
                    { "greaterThan": { "search": "totalShareholding", "match": "25" }, "equalTo": { "search": "countryOfResidence", "match": "GB" } },
                    { "notEqualTo": { "search": "highRisk", "match": "yes" } }
                ]
            };

            const valid = genericValidation.requiredValueIfOne(null, options, 'checkField', person);

            expect(valid).toBe(': ERROR options must contain required `value`');
        });

        it('errors with incorrect structure', () => {
            const person = {
                checkField: 'given',
                countryOfResidence: "GB",
                totalShareholding: 30,
                highRisk: 'no',
            };

            const options = {
                value: 'given',
                scenarios: { "greaterThan": { "search": "totalShareholding", "match": "25" }, "equalTo": { "search": "countryOfResidence", "match": "GB" } }
            };

            const valid = genericValidation.requiredValueIfOne(null, options, 'checkField', person);

            expect(valid).toBe(': ERROR options must contain `scenarios` array');
        });

        it('should pass with passing validators', () => {
            const person = {
                checkField: 'given',
                countryOfResidence: "GB",
                totalShareholding: 30,
                highRisk: 'no',
            };

            const options = {
                value: 'given',
                scenarios: [
                    { "greaterThan": { "search": "totalShareholding", "match": "25" }, "equalTo": { "search": "countryOfResidence", "match": "GB" } },
                    { "notEqualTo": { "search": "highRisk", "match": "yes" } }
                ]
            };

            const valid = genericValidation.requiredValueIfOne(person.checkField, options, 'checkField', person);

            expect(valid).toBe(null);
        });

        it('should pass with mixed pass/fail validators', () => {
            const person = {
                checkField: 'given',
                countryOfResidence: "DE",
                totalShareholding: 30,
                highRisk: 'no',
            };

            const options = {
                value: 'given',
                scenarios: [
                    { "greaterThan": { "search": "totalShareholding", "match": "25" }, "equalTo": { "search": "countryOfResidence", "match": "GB" } },
                    { "notEqualTo": { "search": "highRisk", "match": "yes" } }
                ]
            };

            const valid = genericValidation.requiredValueIfOne(person.checkField, options, 'checkField', person);

            expect(valid).toBe(null);
        });

        it('should pass with failing validators', () => {
            const person = {
                checkField: 'given',
                countryOfResidence: "DE",
                totalShareholding: 20,
                highRisk: 'yes',
            };

            const options = {
                value: 'given',
                scenarios: [
                    { "greaterThan": { "search": "totalShareholding", "match": "25" }, "equalTo": { "search": "countryOfResidence", "match": "GB" } },
                    { "notEqualTo": { "search": "highRisk", "match": "yes" } }
                ]
            };

            const valid = genericValidation.requiredValueIfOne(person.checkField, options, 'checkField', person);

            expect(valid).toBe(null);
        });
    });
});
