const companyValidation = require('./functionsCompany');

jest.mock('google-spreadsheet', () => ({
    GoogleSpreadsheet: jest.fn().mockImplementation(() => {
        return {
            useServiceAccountAuth: jest.fn().mockReturnValue(true),
            loadInfo: jest.fn().mockReturnValue(true),
            sheetsById: [
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

describe('requiresUBOChecks()', () => {
    it('test 1', () => {
        const company = {
            "type": null,
            "isPublic": true,
            "citiCoveredExchange": true,
            "distinctShareholders": [
                {
                    "totalShareholding": 19,
                    "shareholderType": "P"
                },
                {
                    "totalShareholding": 30,
                    "shareholderType": "P",
                    "isPublic": true,
                    "citiCoveredExchange": true
                },
                {
                    "totalShareholding": 51,
                    "shareholderType": "C",
                    "isPublic": false,
                    "citiCoveredExchange": false
                }
            ]
        };

        const required = companyValidation.requiresUBOChecks(company.isPublic, {}, 'isPublic', company);

        expect(required).toEqual({ required: false });
    });

    it('test 2', () => {
        const company = {
            "type": null,
            "isPublic": true,
            "citiCoveredExchange": false,
            "distinctShareholders": [
                {
                    "totalShareholding": 19,
                    "shareholderType": "P"
                },
                {
                    "totalShareholding": 30,
                    "shareholderType": "P",
                    "isPublic": true,
                    "citiCoveredExchange": true
                },
                {
                    "totalShareholding": 51,
                    "shareholderType": "C",
                    "isPublic": false,
                    "citiCoveredExchange": false
                }
            ]
        };

        const required = companyValidation.requiresUBOChecks(company.isPublic, {}, 'isPublic', company);

        expect(required).toEqual({ required: false });
    });

    it('test 3', () => {
        const company = {
            "type": null,
            "isPublic": false,
            "citiCoveredExchange": false,
            "distinctShareholders": [
                {
                    "totalShareholding": 19,
                    "shareholderType": "P"
                },
                {
                    "totalShareholding": 30,
                    "shareholderType": "P",
                    "isPublic": true,
                    "citiCoveredExchange": true
                },
                {
                    "totalShareholding": 51,
                    "shareholderType": "C",
                    "isPublic": true,
                    "citiCoveredExchange": false
                }
            ]
        };

        const required = companyValidation.requiresUBOChecks(company.isPublic, {}, 'isPublic', company);

        expect(required).toEqual({ required: true });
    });

    it('test 4', () => {
        const company = {
            "type": null,
            "isPublic": false,
            "citiCoveredExchange": false,
            "distinctShareholders": [
                {
                    "totalShareholding": 19,
                    "shareholderType": "P"
                },
                {
                    "totalShareholding": 30,
                    "shareholderType": "P",
                    "isPublic": true,
                    "citiCoveredExchange": true
                },
                {
                    "totalShareholding": 51,
                    "shareholderType": "C",
                    "isPublic": true,
                    "citiCoveredExchange": true
                }
            ]
        };

        const required = companyValidation.requiresUBOChecks(company.isPublic, {}, 'isPublic', company);

        expect(required).toEqual({ required: false });
    });

    it('test 5', () => {
        const company = {
            "type": null,
            "isPublic": false,
            "citiCoveredExchange": false,
            "distinctShareholders": [
                {
                    "totalShareholding": 19,
                    "shareholderType": "P"
                },
                {
                    "totalShareholding": 30,
                    "shareholderType": "P",
                    "isPublic": true,
                    "citiCoveredExchange": true
                },
                {
                    "totalShareholding": 51,
                    "shareholderType": "C",
                    "isPublic": true,
                    "citiCoveredExchange": false
                }
            ]
        };

        const required = companyValidation.requiresUBOChecks(company.isPublic, {}, 'isPublic', company);

        expect(required).toEqual({ required: true });
    });

    it('test 6', () => {
        const company = {
            "type": null,
            "isPublic": false,
            "citiCoveredExchange": false,
            "distinctShareholders": [
                {
                    "totalShareholding": 19,
                    "shareholderType": "P"
                },
                {
                    "totalShareholding": 30,
                    "shareholderType": "P",
                    "isPublic": true,
                    "citiCoveredExchange": true
                },
                {
                    "totalShareholding": 51,
                    "shareholderType": "C",
                    "isPublic": true,
                    "citiCoveredExchange": false
                }
            ]
        };

        const required = companyValidation.requiresUBOChecks(company.isPublic, {}, 'isPublic', company);

        expect(required).toEqual({ required: true });
    });

    it('handles market exceptions', () => {

        const company = {
            "type": null,
            "isPublic": true,
            "citiCoveredExchange": true,
            "distinctShareholders": [
                {
                    "totalShareholding": 19,
                    "shareholderType": "P"
                },
                {
                    "totalShareholding": 30,
                    "shareholderType": "P",
                    "isPublic": true,
                    "citiCoveredExchange": true
                },
                {
                    "totalShareholding": 51,
                    "shareholderType": "C",
                    "isPublic": false,
                    "citiCoveredExchange": false
                }
            ]
        };

        const required = companyValidation.requiresUBOChecks(company.isPublic, { exceptions: ['IT', 'PT'] }, 'isPublic', company);

        expect(required).toEqual({ required: true, for: ['IT', 'PT'] });
    });
});

describe('ageLessThanThree()', () => {
    it('passes if provided', () => {
        const company = {
            fundingSources: 'yes',
            incorporationDate: '2018-01-01',
        };

        const valid = companyValidation.ageLessThanThree(company.fundingSources, {}, 'fundingSources', company);

        expect(valid).toBe(null);
    });

    it('passes if older and provided', () => {
        const company = {
            fundingSources: 'yes',
            incorporationDate: '2015-01-01',
        };

        const valid = companyValidation.ageLessThanThree(company.fundingSources, {}, 'fundingSources', company);

        expect(valid).toBe(null);
    });

    it('passes if older and not provided', () => {
        const company = {
            fundingSources: null,
            incorporationDate: '2015-01-01',
        };

        const valid = companyValidation.ageLessThanThree(company.fundingSources, {}, 'fundingSources', company);

        expect(valid).toBe(null);
    });

    it('fails if younger and not provided', () => {
        const company = {
            fundingSources: null,
            incorporationDate: '2018-01-01',
        };

        const valid = companyValidation.ageLessThanThree(company.fundingSources, {}, 'fundingSources', company);

        expect(valid).toEqual('is required if incorporation is < 3yrs')
    });

    it('passes if provided incorporation date not given', () => {
        const company = {
            fundingSources: 'yes'
        };

        const valid = companyValidation.ageLessThanThree(company.fundingSources, {}, 'fundingSources', company);

        expect(valid).toEqual(null);
    });

    it('fails if not provided and incorporation date not given', () => {
        const company = {
            fundingSources: null,
        };

        const valid = companyValidation.ageLessThanThree(company.fundingSources, {}, 'fundingSources', company);

        expect(valid).toEqual('is required if incorporation is < 3yrs')
    });

    it('fails if not provided and incorporation date given null', () => {
        const company = {
            incorporationDate: null,
            fundingSources: null,
        };

        const valid = companyValidation.ageLessThanThree(company.fundingSources, {}, 'fundingSources', company);

        expect(valid).toEqual('is required if incorporation is < 3yrs')
    });

    it('fails if not provided and incorporation date not valid', () => {
        const company = {
            incorporationDate: '',
            fundingSources: null,
        };

        const valid = companyValidation.ageLessThanThree(company.fundingSources, {}, 'fundingSources', company);

        expect(valid).toEqual('is required if incorporation is < 3yrs')
    });

    it('correctly parses date if in DD-MM-YYYY format and recognises < 3 years old', () => {
        const company = {
            incorporationDate: '15-01-2019',
            fundingSources: null,
        };

        const valid = companyValidation.ageLessThanThree(company.fundingSources, {}, 'fundingSources', company);

        expect(valid).toEqual('is required if incorporation is < 3yrs')
    });


    it('correctly parses date if in DD-MM-YYYY format and recognises > 3 years old', () => {
        const company = {
            incorporationDate: '15-01-2012',
            fundingSources: null,
        };

        const valid = companyValidation.ageLessThanThree(company.fundingSources, {}, 'fundingSources', company);

        expect(valid).toEqual(null)
    });
});

describe('shareholdingGreaterThan()', () => {

});

describe('bearerSharesChecks()', () => {
    describe('passes validation', () => {
        it('bearer shares not allowed by country or company', async () => {
            const company = {
                countryCode: 'UK',
                type: 'A',
            };

            const validate1 = await companyValidation.bearerSharesChecks('null', {}, 'bearerShareRiskMitigationMethod', company);
            const validate2 = await companyValidation.bearerSharesChecks('null', {}, 'bearerShareClientAttestation', company);
            const validate3 = await companyValidation.bearerSharesChecks('null', {}, 'bearerShareEvidenceLink', company);

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

            const validate1 = await companyValidation.bearerSharesChecks('null', {}, 'bearerShareRiskMitigationMethod', company);
            const validate2 = await companyValidation.bearerSharesChecks('null', {}, 'bearerShareClientAttestation', company);
            const validate3 = await companyValidation.bearerSharesChecks('null', {}, 'bearerShareEvidenceLink', company);

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

            const validate1 = await companyValidation.bearerSharesChecks('null', {}, 'bearerShareRiskMitigationMethod', company);
            const validate2 = await companyValidation.bearerSharesChecks('null', {}, 'bearerShareClientAttestation', company);
            const validate3 = await companyValidation.bearerSharesChecks('null', {}, 'bearerShareEvidenceLink', company);

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

            const validate1 = await companyValidation.bearerSharesChecks('null', {}, 'bearerShareRiskMitigationMethod', company);
            const validate2 = await companyValidation.bearerSharesChecks('null', {}, 'bearerShareClientAttestation', company);
            const validate3 = await companyValidation.bearerSharesChecks('null', {}, 'bearerShareEvidenceLink', company);

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

            const validate1 = await companyValidation.bearerSharesChecks('null', {}, 'bearerShareRiskMitigationMethod', company);
            const validate2 = await companyValidation.bearerSharesChecks('null', {}, 'bearerShareClientAttestation', company);
            const validate3 = await companyValidation.bearerSharesChecks('null', {}, 'bearerShareEvidenceLink', company);

            expect(validate1).toEqual(null);
            expect(validate2).toEqual(null);
            expect(validate3).toEqual(null);
        });

        it('bearer shares not allowed by country but allowed by company', async () => {
            const company = {
                countryCode: 'IT',
                type: 'B',
            };

            const validate1 = await companyValidation.bearerSharesChecks('null', {}, 'bearerShareRiskMitigationMethod', company);
            const validate2 = await companyValidation.bearerSharesChecks('null', {}, 'bearerShareClientAttestation', company);
            const validate3 = await companyValidation.bearerSharesChecks('null', {}, 'bearerShareEvidenceLink', company);

            expect(validate1).toEqual(null);
            expect(validate2).toEqual(null);
            expect(validate3).toEqual('is required');
        });

        it('bearer shares not allowed by country but allowed by company (array)', async () => {
            const company = {
                countryCode: 'FR',
                type: 'B',
            };

            const validate1 = await companyValidation.bearerSharesChecks('null', {}, 'bearerShareRiskMitigationMethod', company);
            const validate2 = await companyValidation.bearerSharesChecks('null', {}, 'bearerShareClientAttestation', company);
            const validate3 = await companyValidation.bearerSharesChecks('null', {}, 'bearerShareEvidenceLink', company);

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

            const validate1 = await companyValidation.bearerSharesChecks('null', {}, 'bearerShareRiskMitigationMethod', company);
            const validate2 = await companyValidation.bearerSharesChecks('null', {}, 'bearerShareClientAttestation', company);
            const validate3 = await companyValidation.bearerSharesChecks('null', {}, 'bearerShareEvidenceLink', company);

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

            const validate1 = await companyValidation.bearerSharesChecks('null', {}, 'bearerShareRiskMitigationMethod', company);
            const validate2 = await companyValidation.bearerSharesChecks('null', {}, 'bearerShareClientAttestation', company);
            const validate3 = await companyValidation.bearerSharesChecks('null', {}, 'bearerShareEvidenceLink', company);

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

            const validate1 = await companyValidation.bearerSharesChecks('null', {}, 'bearerShareRiskMitigationMethod', company);
            const validate2 = await companyValidation.bearerSharesChecks('null', {}, 'bearerShareClientAttestation', company);
            const validate3 = await companyValidation.bearerSharesChecks('null', {}, 'bearerShareEvidenceLink', company);

            expect(validate3).toEqual('is required');
            expect(validate1).toEqual(null);
            expect(validate2).toEqual(null);
        });
    });

});

describe('naicsChecks()', () => {

});
