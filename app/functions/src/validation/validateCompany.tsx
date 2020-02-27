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

type market = 'Core' | 'GB' | 'DE' | 'FR' | 'RO' | 'IT' | 'SE';
type indexedObject = { [key: string]: any };

server.post('*/', function (req: any, res: any) {
    const { company } = req.body;

    const rulesCompany = admin.firestore().collection('companyRules');
    const rulesetCompany = {} as indexedObject;
    const companyMarketRulesets = {
        Core: {} as indexedObject,
        GB: {} as indexedObject,
        DE: {} as indexedObject,
        FR: {} as indexedObject,
        RO: {} as indexedObject,
        IT: {} as indexedObject,
        SE: {} as indexedObject,
    };
    const companyMarketsToValidate = Object.keys(companyMarketRulesets) as Array<market>;
    const companyMarketValidation = {} as { [key: string]: indexedObject };

    const rulesPerson = admin.firestore().collection('personRules');
    const rulesetPerson = {} as indexedObject;
    const personMarketRulesets = {
        Core: {} as indexedObject,
        GB: {} as indexedObject,
        DE: {} as indexedObject,
        FR: {} as indexedObject,
        RO: {} as indexedObject,
        IT: {} as indexedObject,
        SE: {} as indexedObject,
    };
    const personMarketsToValidate = Object.keys(personMarketRulesets) as Array<market>;
    const peopleMarketValidation = {} as { [key: string]: indexedObject };

    rulesCompany.get().then(async (rulesCompanyItem: any) => {
        rulesCompanyItem.forEach((doc: any) => {
            const rule = doc.data();
            const rulesMarkets = rule.marketRuleMapping;
            delete rule.marketRuleMapping;
            const ruleName = Object.keys(rule)[0] as string;

            rulesMarkets.forEach((market: market) => {
                companyMarketRulesets[market][ruleName] = rule[ruleName]
            });
            rulesetCompany[ruleName] = rule[ruleName];
        });

        // marketRulesets.all = rulesetCompany;

        const responsesCompany = companyMarketsToValidate.map((market: market) => {
            return validateJS.validate.async(company, companyMarketRulesets[market], { cleanAttributes: false }).then(null, (errors: any) => {
                const failedRules = errors ? Object.keys(errors).length : 0;
                const numRules = Object.keys(companyMarketRulesets[market]).length;

                const valid = {
                    completion: ((numRules - failedRules) / numRules),
                    errors,
                    passed: numRules - failedRules,
                    failed: failedRules,
                    total: numRules,
                };

                companyMarketValidation[market] = valid;
            });
        });

        rulesPerson.get().then(async (rulesPersonItem: any) => {
            rulesPersonItem.forEach((doc: any) => {
                const rule = doc.data();
                const rulesMarkets = rule.marketRuleMapping;
                delete rule.marketRuleMapping;
                const ruleName = Object.keys(rule)[0] as string;

                rulesMarkets.forEach((market: market) => {
                    personMarketRulesets[market][ruleName] = rule[ruleName]
                });
                rulesetPerson[ruleName] = rule[ruleName];
            });

            const shareholders = company.distinctShareholders.filter((shareholder: any) => shareholder.totalShareholding >= 10);

            const responsesPeople = shareholders.map((shareholder: any) => {
                const personMarketValidation = {} as { [key: string]: indexedObject };

                personMarketsToValidate.map((market: market) => {
                    validateJS.validate.async(company, personMarketRulesets[market], { cleanAttributes: false }).then(null, (errors: any) => {
                        const failedRules = errors ? Object.keys(errors).length : 0;
                        const numRules = Object.keys(personMarketRulesets[market]).length;

                        const valid = {
                            completion: ((numRules - failedRules) / numRules),
                            errors,
                            passed: numRules - failedRules,
                            failed: failedRules,
                            total: numRules,
                        };

                        return personMarketValidation[market] = valid;
                    });

                    peopleMarketValidation[shareholder.docId] = personMarketValidation;
                });

            });

            const responses = responsesCompany.concat(responsesPeople);

            await Promise.all(responses);

            return res.send({ company: companyMarketValidation, ...peopleMarketValidation });
        });
    });
});
module.exports = functions.https.onRequest(server);
