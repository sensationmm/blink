const validationFunctions = require('./functionsPerson');

describe('shareholdingGreaterThan()', () => {
    it('pass if shareholding lower than threshold', () => {
        const person = { totalShareholding: 8.05 };

        const valid = validationFunctions.shareholdingGreaterThan(person.totalShareholding, '10', 'totalShareholding', person);

        expect(valid).toBe(null);
    });

    it('fail if shareholding higher than threshold and field does not exist', () => {
        const person = { totalShareholding: 12.41 };

        const valid = validationFunctions.shareholdingGreaterThan(person.totalShareholding, '10', 'testField', person);

        expect(valid).toEqual('is required if shareholding > 10%');
    });

    it('pass if shareholding higher than threshold and field does exist', () => {
        const person = { totalShareholding: 12.41, testField: 'asd' };

        const valid = validationFunctions.shareholdingGreaterThan(person.totalShareholding, '10', 'testField', person);

        expect(valid).toEqual(null);
    });
});
