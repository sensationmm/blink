export { }

const functions = require('firebase-functions');
const admin = require("firebase-admin");
const cors = require('cors');
const validateJS = require('validate.js');
const express = require('express');
const validationCompany = require('../../../../src/utils/validation/functionsCompany');
const server = express();
server.use(cors());

// add custom company validators
const validationCompanyKeys = Object.keys(validationCompany);
validationCompanyKeys.forEach((key) => {
    validateJS.validate.validators[key] = validationCompany[key];
});

server.post('*/', function (req: any, res: any) {
    const { company } = req.body;

    const rules = admin.firestore().collection('companyRules');
    const ruleset = {} as { [key: string]: any };

    rules.get().then((list: any) => {
        let numRules = 0;
        list.forEach((doc: any) => {
            numRules++;
            const rule = doc.data();
            const ruleName = Object.keys(rule)[0] as string;
            ruleset[ruleName] = rule[ruleName];
        });

        return validateJS.validate.async(company, ruleset, { cleanAttributes: false }).then(null, (errors: any) => {
            const failedRules = errors ? Object.keys(errors).length : 0;

            const valid = {
                completion: ((numRules - failedRules) / numRules).toFixed(2),
                errors,
                passed: numRules - failedRules,
                failed: failedRules,
                total: numRules,
            };

            return res.send(valid);
        });

    });
});
module.exports = functions.https.onRequest(server);
//# sourceMappingURL=validateCompany.js.map
