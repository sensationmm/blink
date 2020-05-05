export { }

const functions = require('firebase-functions');
const admin = require("firebase-admin");
const moment = require('moment');
const cors = require('cors');
const validateJS = require('validate.js');
const express = require('express');
const validationGeneric = require('./functionsGeneric');
const validationCompany = require('./functionsCompany');
const validationPerson = require('./functionsPerson');
const parseDate = require('./functionsCompany').parseDate;
const server = express();
server.use(cors());

// add custom company validators
const customValidation = { ...validationGeneric, ...validationCompany, ...validationPerson };
const customValidationKeys = Object.keys(customValidation);
customValidationKeys.forEach((key) => {
    validateJS.validate.validators[key] = customValidation[key];
});

validateJS.validate.validators.type.types.dateString = (value: any) => {
    if (!moment(value).isValid()) {
        const parsedDate = parseDate(value)
        return moment(parsedDate).isValid()
    }

    return moment(value).isValid()
};

type market = 'Core' | 'GB' | 'DE' | 'FR' | 'RO' | 'IT' | 'SE';
type indexedObject = { [key: string]: any };

server.post('*/', function (req: any, res: any) {
    const { company, ownershipThreshold, markets } = req.body;

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
    const companyMarketsToValidate = ['Core', ...markets] as Array<market>;
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
    const personMarketsToValidate = ['Core', ...markets] as Array<market>;
    const peopleMarketValidation = {} as { [key: string]: indexedObject };

    rulesCompany.get().then(async (rulesCompanyItem: any) => {
        rulesCompanyItem.forEach((doc: any) => {
            const rule = doc.data();
            const rulesMarkets = rule.marketRuleMapping;
            delete rule.marketRuleMapping;
            delete rule.title;
            delete rule.description;
            delete rule.edits;
            const ruleName = Object.keys(rule)[0] as string;

            rulesMarkets.filter((market: market) => companyMarketsToValidate.indexOf(market) > -1).forEach((market: market) => {
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
                    delete rule.description;
                    delete rule.title;
                    delete rule.edits;
                    const ruleName = Object.keys(rule)[0] as string;

                    rulesMarkets.filter((market: market) => personMarketsToValidate.indexOf(market) > -1).forEach((market: market) => {
                        personMarketRulesets[market][ruleName] = rule[ruleName]
                    });
                    rulesetPerson[ruleName] = rule[ruleName];
                });

                let shareholders = company.distinctShareholders.filter((shareholder: any) => shareholder.totalShareholding >= parseInt(ownershipThreshold));

                shareholders = shareholders.concat(company.officers);

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
                                    failed: 0,
                                    errors: {}
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
                    const officerRanking = [
                        'Chairperson',
                        'President',
                        'CFO',
                        'CEO',
                        'Managing Director',
                    ];
                    let highestRanking = { rank: -1 } as indexedObject;
                    responsesOfficers = company.officers
                        .map((officer: any) => {
                            if (officer.title && officerRanking.indexOf(officer.title) > highestRanking.rank) {
                                highestRanking = {
                                    id: officer.docId,
                                    rank: officerRanking.indexOf(officer.title)
                                };
                            }

                            return officer;
                        })
                        .filter((officer: any) => {
                            if (officer.title) {
                                if (markets.indexOf('DE') > -1 && company.riskRating?.value === 5) {
                                    return true;
                                } else {
                                    return highestRanking.id === officer.docId;
                                }
                            }

                            return false;
                        }).map((officer: any) => {
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

                return res.send({ company: companyMarketValidation, ...peopleMarketValidation });
            });
        } else {
            await Promise.all(responsesCompany);
            return res.send({ company: companyMarketValidation });
        }
    });
});
module.exports = functions.https.onRequest(server);
