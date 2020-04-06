export { }

const functions = require('firebase-functions');
const admin = require("firebase-admin");
const cors = require('cors');
const validateJS = require('validate.js');
const express = require('express');
const validationGeneric = require('./functionsGeneric');
const validationCompany = require('./functionsCompany');
const validationPerson = require('./functionsPerson');
const server = express();
server.use(cors());

// add custom company validators
const customValidation = { ...validationGeneric, ...validationCompany, ...validationPerson };
const customValidationKeys = Object.keys(customValidation);
customValidationKeys.forEach((key) => {
    validateJS.validate.validators[key] = customValidation[key];
});

type market = 'Core' | 'GB' | 'DE' | 'FR' | 'RO' | 'IT' | 'SE';
type indexedObject = { [key: string]: any };

server.post('*/', function (req: any, res: any) {
    const { company, ownershipThreshold } = req.body;

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

        const responsesCompany = companyMarketsToValidate.map((market: market) => {
            return validateJS.validate.async(company, companyMarketRulesets[market], { cleanAttributes: false, market }).then(() => {
                const numRules = Object.keys(companyMarketRulesets[market]).length;

                const valid = {
                    completion: numRules / numRules,
                    passed: numRules,
                    total: numRules,
                };

                companyMarketValidation[market] = valid;
            }, (errors: any) => {
                const failedRules = errors ? Object.keys(errors).length : 0;
                const numRules = Object.keys(companyMarketRulesets[market]).length;

                const groupedErrors: indexedObject = {};

                Object.keys(errors).forEach(item => {
                    const error = item.split('.');

                    const errorType = error.pop();
                    const errorField = error.join('.');

                    if (errorField) {
                        if (!groupedErrors[errorField]) {
                            groupedErrors[errorField] = {};
                        }

                        if (errorType) {
                            groupedErrors[errorField][errorType] = errors[item];
                        } else {
                            groupedErrors[errorField] = errors[item];
                        }
                    }
                });

                const valid = {
                    completion: ((numRules - failedRules) / numRules),
                    errors: groupedErrors,
                    passed: numRules - failedRules,
                    failed: failedRules,
                    total: numRules,
                };

                companyMarketValidation[market] = valid;
            });
        });

        const uboChecksRequired = validationCompany.requiresUBOChecks(null, { exceptions: ['IT'] }, null, company);

        if (uboChecksRequired.required === true) {
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

                const shareholders = company.distinctShareholders.filter((shareholder: any) => shareholder.totalShareholding >= parseInt(ownershipThreshold));

                let hasShareholdersOver25 = false;

                const responsesPeople = shareholders.map((shareholder: any) => {
                    const personMarketValidation = {} as { [key: string]: indexedObject };

                    personMarketsToValidate
                        .filter((market: market) => {
                            return market === 'Core' || !uboChecksRequired.for || (uboChecksRequired.for && uboChecksRequired.for.length > 0 && uboChecksRequired.for.indexOf(market) > -1)
                        })
                        .map((market: market) => {
                            if (shareholder.totalShareholding > 25) {
                                hasShareholdersOver25 = true;
                            }

                            validateJS.validate.async(shareholder, personMarketRulesets[market], { cleanAttributes: false, market }).then(() => {
                                const numRules = Object.keys(personMarketRulesets[market]).length;

                                const valid = {
                                    completion: numRules / numRules,
                                    passed: numRules,
                                    total: numRules,
                                };

                                return personMarketValidation[market] = valid;
                            }, (errors: any) => {
                                const failedRules = errors ? Object.keys(errors).length : 0;
                                const numRules = Object.keys(personMarketRulesets[market]).length;

                                const groupedErrors: indexedObject = {};

                                Object.keys(errors).forEach(item => {
                                    const error = item.split('.');

                                    const errorType = error.pop();
                                    const errorField = error.join('.');

                                    if (errorField) {
                                        if (!groupedErrors[errorField]) {
                                            groupedErrors[errorField] = {};
                                        }

                                        if (errorType) {
                                            groupedErrors[errorField][errorType] = errors[item];
                                        } else {
                                            groupedErrors[errorField] = errors[item];
                                        }
                                    }
                                });

                                const valid = {
                                    completion: ((numRules - failedRules) / numRules),
                                    errors: groupedErrors,
                                    passed: numRules - failedRules,
                                    failed: failedRules,
                                    total: numRules,
                                };

                                return personMarketValidation[market] = valid;
                            });

                            peopleMarketValidation[shareholder.docId] = personMarketValidation;
                        });

                });

                let responsesOfficers;
                if (!hasShareholdersOver25) {
                    //requires fictive UBOs
                    responsesOfficers = company.officers.map((officer: any) => {
                        const officerMarketValidation = {} as { [key: string]: indexedObject };

                        personMarketsToValidate
                            .filter((market: market) => {
                                return market === 'Core' || !uboChecksRequired.for || (uboChecksRequired.for && uboChecksRequired.for.length > 0 && uboChecksRequired.for.indexOf(market) > -1)
                            })
                            .map((market: market) => {
                                validateJS.validate.async(officer, personMarketRulesets[market], { cleanAttributes: false, market }).then(() => {
                                    const numRules = Object.keys(personMarketRulesets[market]).length;

                                    const valid = {
                                        completion: numRules / numRules,
                                        passed: numRules,
                                        total: numRules,
                                    };

                                    return officerMarketValidation[market] = valid;
                                }, (errors: any) => {
                                    const failedRules = errors ? Object.keys(errors).length : 0;
                                    const numRules = Object.keys(personMarketRulesets[market]).length;

                                    const groupedErrors: indexedObject = {};

                                    Object.keys(errors).forEach(item => {
                                        const error = item.split('.');

                                        const errorType = error.pop();
                                        const errorField = error.join('.');

                                        if (errorField) {
                                            if (!groupedErrors[errorField]) {
                                                groupedErrors[errorField] = {};
                                            }

                                            if (errorType) {
                                                groupedErrors[errorField][errorType] = errors[item];
                                            } else {
                                                groupedErrors[errorField] = errors[item];
                                            }
                                        }
                                    });

                                    const valid = {
                                        completion: ((numRules - failedRules) / numRules),
                                        errors: groupedErrors,
                                        passed: numRules - failedRules,
                                        failed: failedRules,
                                        total: numRules,
                                    };

                                    return officerMarketValidation[market] = valid;
                                });

                                peopleMarketValidation[officer.docId] = officerMarketValidation;
                            });

                    });
                }

                const responses = responsesCompany.concat(responsesPeople).concat(responsesOfficers);

                await Promise.all(responses);

                let returnedPeopleMarketValidation: any = peopleMarketValidation;
                // Object.keys(returnedPeopleMarketValidation).forEach((docId: string) => {
                //     if (Object.keys(returnedPeopleMarketValidation[docId]).length === 0) {
                //         delete returnedPeopleMarketValidation[docId];
                //     }
                // });

                return res.send({ company: companyMarketValidation, ...returnedPeopleMarketValidation });
            });
        } else {
            await Promise.all(responsesCompany);
            return res.send({ company: companyMarketValidation });
        }
    });
});
module.exports = functions.https.onRequest(server);
