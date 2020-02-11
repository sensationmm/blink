import validationFunctions from './functionsCompany';

jest.mock('google-spreadsheet', () => ({
    GoogleSpreadsheet: jest.fn().mockImplementation(() => {
        return {
            useServiceAccountAuth: jest.fn().mockReturnValue(true),
            loadInfo: jest.fn().mockReturnValue(true),
            sheetsByIndex: [
                {
                    getRows: jest.fn().mockReturnValue([
                        { 'Alpha-2 code': 'DE', 'AllowBearerShares': 'Y' },
                        { 'Alpha-2 code': 'UK', 'AllowBearerShares': 'N' },
                        { 'Alpha-2 code': 'IT', 'AllowBearerShares': 'N', 'CompanyTypeException': 'B' },
                        { 'Alpha-2 code': 'FR', 'AllowBearerShares': 'N', 'CompanyTypeException': ['a', 'B'] },
                    ])
                }
            ],
        };
    })
}));

describe('ageLessThanThree()', () => {
    it('passes if provided', () => {
        const company = {
            fundingSources: 'yes',
            incorporationDate: '2018-01-01',
        };

        const valid = validationFunctions.ageLessThanThree(company.fundingSources, {}, 'fundingSources', company);

        expect(valid).toBe(null);
    });

    it('passes if older and provided', () => {
        const company = {
            fundingSources: 'yes',
            incorporationDate: '2015-01-01',
        };

        const valid = validationFunctions.ageLessThanThree(company.fundingSources, {}, 'fundingSources', company);

        expect(valid).toBe(null);
    });

    it('passes if older and not provided', () => {
        const company = {
            fundingSources: null,
            incorporationDate: '2015-01-01',
        };

        const valid = validationFunctions.ageLessThanThree(company.fundingSources, {}, 'fundingSources', company);

        expect(valid).toBe(null);
    });

    it('fails if younger and not provided', () => {
        const company = {
            fundingSources: null,
            incorporationDate: '2018-01-01',
        };

        const valid = validationFunctions.ageLessThanThree(company.fundingSources, {}, 'fundingSources', company);

        expect(valid).toEqual('is required if incorporation is < 3yrs')
    });

    it('passes if provided incorporation date not given', () => {
        const company = {
            fundingSources: 'yes'
        };

        const valid = validationFunctions.ageLessThanThree(company.fundingSources, {}, 'fundingSources', company);

        expect(valid).toEqual(null);
    });

    it('fails if not provided and incorporation date not given', () => {
        const company = {
            fundingSources: null,
        };

        const valid = validationFunctions.ageLessThanThree(company.fundingSources, {}, 'fundingSources', company);

        expect(valid).toEqual('is required if incorporation is < 3yrs')
    });

    it('fails if not provided and incorporation date given null', () => {
        const company = {
            incorporationDate: null,
            fundingSources: null,
        };

        const valid = validationFunctions.ageLessThanThree(company.fundingSources, {}, 'fundingSources', company);

        expect(valid).toEqual('is required if incorporation is < 3yrs')
    });

    it('fails if not provided and incorporation date not valid', () => {
        const company = {
            incorporationDate: '',
            fundingSources: null,
        };

        const valid = validationFunctions.ageLessThanThree(company.fundingSources, {}, 'fundingSources', company);

        expect(valid).toEqual('is required if incorporation is < 3yrs')
    });
});

describe('bearerSharesChecks()', () => {
    describe('passes validation', () => {
        it('bearer shares not allowed by country or company', async () => {
            const company = {
                countryCode: 'UK',
                type: 'A',
            };

            const validate1 = await validationFunctions.bearerSharesChecks('null', {}, 'bearerShareRiskMitigationMethod', company);
            const validate2 = await validationFunctions.bearerSharesChecks('null', {}, 'bearerShareClientAttestation', company);
            const validate3 = await validationFunctions.bearerSharesChecks('null', {}, 'bearerShareEvidenceLink', company);

            expect(validate1).toEqual(null);
            expect(validate2).toEqual(null);
            expect(validate3).toEqual(null);
        });

        it('risk mitigation method required', async () => {
            const company = {
                countryCode: 'DE',
                type: 'A',
                companyAllowsBearerShares: true,
                bearerSharesOutstanding: 15,
                bearerShareRiskMitigationMethod: 'aasd',
            };

            const validate1 = await validationFunctions.bearerSharesChecks('null', {}, 'bearerShareRiskMitigationMethod', company);
            const validate2 = await validationFunctions.bearerSharesChecks('null', {}, 'bearerShareClientAttestation', company);
            const validate3 = await validationFunctions.bearerSharesChecks('null', {}, 'bearerShareEvidenceLink', company);

            expect(validate1).toEqual(null);
            expect(validate2).toEqual(null);
            expect(validate3).toEqual(null);
        });

        it('client attestation required', async () => {
            const company = {
                countryCode: 'DE',
                type: 'A',
                companyAllowsBearerShares: true,
                bearerSharesOutstanding: 7,
                bearerShareClientAttestation: 'aasd',
            };

            const validate1 = await validationFunctions.bearerSharesChecks('null', {}, 'bearerShareRiskMitigationMethod', company);
            const validate2 = await validationFunctions.bearerSharesChecks('null', {}, 'bearerShareClientAttestation', company);
            const validate3 = await validationFunctions.bearerSharesChecks('null', {}, 'bearerShareEvidenceLink', company);

            expect(validate2).toEqual(null);
            expect(validate1).toEqual(null);
            expect(validate3).toEqual(null);
        });

        it('evidence required', async () => {
            const company = {
                countryCode: 'DE',
                type: 'A',
                companyAllowsBearerShares: false,
                bearerSharesOutstanding: 7,
                bearerShareEvidenceLink: 'aasd',
            };

            const validate1 = await validationFunctions.bearerSharesChecks('null', {}, 'bearerShareRiskMitigationMethod', company);
            const validate2 = await validationFunctions.bearerSharesChecks('null', {}, 'bearerShareClientAttestation', company);
            const validate3 = await validationFunctions.bearerSharesChecks('null', {}, 'bearerShareEvidenceLink', company);

            expect(validate3).toEqual(null);
            expect(validate1).toEqual(null);
            expect(validate2).toEqual(null);
        });
    });

    describe('fails validation', () => {
        it('bearer shares country not found', async () => {
            const company = {
                countryCode: 'XY',
                type: 'B',
            };

            const validate1 = await validationFunctions.bearerSharesChecks('null', {}, 'bearerShareRiskMitigationMethod', company);
            const validate2 = await validationFunctions.bearerSharesChecks('null', {}, 'bearerShareClientAttestation', company);
            const validate3 = await validationFunctions.bearerSharesChecks('null', {}, 'bearerShareEvidenceLink', company);

            expect(validate1).toEqual(null);
            expect(validate2).toEqual(null);
            expect(validate3).toEqual(null);
        });

        it('bearer shares not allowed by country but allowed by company', async () => {
            const company = {
                countryCode: 'IT',
                type: 'B',
            };

            const validate1 = await validationFunctions.bearerSharesChecks('null', {}, 'bearerShareRiskMitigationMethod', company);
            const validate2 = await validationFunctions.bearerSharesChecks('null', {}, 'bearerShareClientAttestation', company);
            const validate3 = await validationFunctions.bearerSharesChecks('null', {}, 'bearerShareEvidenceLink', company);

            expect(validate1).toEqual(null);
            expect(validate2).toEqual(null);
            expect(validate3).toEqual('is required');
        });

        it('bearer shares not allowed by country but allowed by company (array)', async () => {
            const company = {
                countryCode: 'FR',
                type: 'B',
            };

            const validate1 = await validationFunctions.bearerSharesChecks('null', {}, 'bearerShareRiskMitigationMethod', company);
            const validate2 = await validationFunctions.bearerSharesChecks('null', {}, 'bearerShareClientAttestation', company);
            const validate3 = await validationFunctions.bearerSharesChecks('null', {}, 'bearerShareEvidenceLink', company);

            expect(validate1).toEqual(null);
            expect(validate2).toEqual(null);
            expect(validate3).toEqual('is required');
        });

        it('risk mitigation method required', async () => {
            const company = {
                countryCode: 'DE',
                type: 'A',
                companyAllowsBearerShares: true,
                bearerSharesOutstanding: 15,
            };

            const validate1 = await validationFunctions.bearerSharesChecks('null', {}, 'bearerShareRiskMitigationMethod', company);
            const validate2 = await validationFunctions.bearerSharesChecks('null', {}, 'bearerShareClientAttestation', company);
            const validate3 = await validationFunctions.bearerSharesChecks('null', {}, 'bearerShareEvidenceLink', company);

            expect(validate1).toEqual('is required');
            expect(validate2).toEqual(null);
            expect(validate3).toEqual(null);
        });

        it('client attestation required', async () => {
            const company = {
                countryCode: 'DE',
                type: 'A',
                companyAllowsBearerShares: true,
                bearerSharesOutstanding: 7,
            };

            const validate1 = await validationFunctions.bearerSharesChecks('null', {}, 'bearerShareRiskMitigationMethod', company);
            const validate2 = await validationFunctions.bearerSharesChecks('null', {}, 'bearerShareClientAttestation', company);
            const validate3 = await validationFunctions.bearerSharesChecks('null', {}, 'bearerShareEvidenceLink', company);

            expect(validate2).toEqual('is required');
            expect(validate1).toEqual(null);
            expect(validate3).toEqual(null);
        });

        it('evidence required', async () => {
            const company = {
                countryCode: 'DE',
                type: 'A',
                companyAllowsBearerShares: false,
                bearerSharesOutstanding: 7,
            };

            const validate1 = await validationFunctions.bearerSharesChecks('null', {}, 'bearerShareRiskMitigationMethod', company);
            const validate2 = await validationFunctions.bearerSharesChecks('null', {}, 'bearerShareClientAttestation', company);
            const validate3 = await validationFunctions.bearerSharesChecks('null', {}, 'bearerShareEvidenceLink', company);

            expect(validate3).toEqual('is required');
            expect(validate1).toEqual(null);
            expect(validate2).toEqual(null);
        });
    });

});

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

        const valid = validationFunctions.requiredIfValueEquals(company.materialMergerDetails, options, 'materialMergerDetails', company);

        expect(valid).toBe(null);
    });

    it('fail if given and value does not match', () => {
        const company = {
            materialMergerDetails: 'blah',
            materialMergers: false,
        };

        const valid = validationFunctions.requiredIfValueEquals(company.materialMergerDetails, options, 'materialMergerDetails', company);

        expect(valid).toBe('cannot be supplied if material mergers is not true');
    });

    it('fail if not given and value matches', () => {
        const company = {
            materialMergers: true,
            materialMergerDetails: null,
        };

        const valid = validationFunctions.requiredIfValueEquals(company.materialMergerDetails, options, 'materialMergerDetails', company);

        expect(valid).toBe('is required if material mergers is true');
    });

    it('pass if not given and value does not match', () => {
        const company = {
            materialMergers: false,
            materialMergerDetails: null,
        };

        const valid = validationFunctions.requiredIfValueEquals(company.materialMergerDetails, options, 'materialMergerDetails', company);

        expect(valid).toBe(null);
    });

    it('error if `search` param not given', () => {
        const optionsError = {
            match: true,
        };

        const company = {
            materialMergerDetails: 'blah',
            materialMergers: true,
        };

        const valid = validationFunctions.requiredIfValueEquals(company.materialMergerDetails, optionsError, 'materialMergerDetails', company);

        expect(valid).toBe(': ERROR requiredIfValueEquals.options.search not defined');
    });

    it('error if `find` param not given', () => {
        const optionsError = {
            search: 'materialMergers',
        };

        const company = {
            materialMergerDetails: 'blah',
            materialMergers: true,
        };

        const valid = validationFunctions.requiredIfValueEquals(company.materialMergerDetails, optionsError, 'materialMergerDetails', company);

        expect(valid).toBe(': ERROR requiredIfValueEquals.options.match not defined');
    });
});
