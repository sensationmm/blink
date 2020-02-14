export { }

const functions = require('firebase-functions');
const admin = require("firebase-admin");
const cors = require('cors');
const validateJS = require('validate.js');
const express = require('express');
const validationCompany = require('./functionsCompany');
const server = express();
server.use(cors());

// add custom company validators
const validationCompanyKeys = Object.keys(validationCompany);
validationCompanyKeys.forEach((key) => {
    validateJS.validate.validators[key] = validationCompany[key];
});

type market = 'all' | 'GB' | 'DE' | 'FR' | 'RO' | 'IT' | 'SE';
type indexedObject = { [key: string]: any };

server.post('*/', function (req: any, res: any) {
    const { company } = req.body;

    const rules = admin.firestore().collection('companyRules');
    const ruleset = {} as indexedObject;

    const marketRulesets = {
        all: {} as indexedObject,
        GB: {} as indexedObject,
        DE: {} as indexedObject,
        FR: {} as indexedObject,
        RO: {} as indexedObject,
        IT: {} as indexedObject,
        SE: {} as indexedObject,
    };
    const marketsToValidate = Object.keys(marketRulesets) as Array<market>;
    const marketValidation = {} as { [key: string]: indexedObject };

    rules.get().then(async (list: any) => {
        list.forEach((doc: any) => {
            const rule = doc.data();
            const rulesMarkets = rule.marketRuleMapping;
            delete rule.marketRuleMapping;
            const ruleName = Object.keys(rule)[0] as string;

            rulesMarkets.forEach((market: market) => {
                marketRulesets[market][ruleName] = rule[ruleName]
            });
            ruleset[ruleName] = rule[ruleName];
        });

        marketRulesets.all = ruleset;

        const responses = marketsToValidate.map((market: market) => {
            validateJS.validate.async(company, marketRulesets[market], { cleanAttributes: false }).then(null, (errors: any) => {
                const failedRules = errors ? Object.keys(errors).length : 0;
                const numRules = Object.keys(marketRulesets[market]).length;

                const valid = {
                    completion: ((numRules - failedRules) / numRules),
                    errors,
                    passed: numRules - failedRules,
                    failed: failedRules,
                    total: numRules,
                };

                marketValidation[market] = valid;
            });
        })

        await Promise.all(responses)

        // var responseObject = { ...response };

        return res.send(marketValidation);
    });
});
module.exports = functions.https.onRequest(server);
