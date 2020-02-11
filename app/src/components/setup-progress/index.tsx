
import React, { useState, useEffect } from "react";
import { addRule, validateCompany } from '../../utils/validation/request';
import { MainSt } from "../styles";
import ReactJson, { InteractionProps } from 'react-json-view'

import { CompanyData } from '../../utils/validation/request';

interface newFile extends Element {
    files: Array<Blob>;
}

const SetupProgress = () => {
    const company = {
        name: '11:FS',
        adverseMediaCheckPassed: null,
        AMLRedFlagsListPassed: null,
        AMLWatchListPassed: null,
        auditedFinancialStatementsProvided: null,
        bankMandatePassed: null,
        bearerShareClientAttestation: null,
        bearerShareEvidenceLink: null,
        bearerShareRiskMitigationMethod: null,
        bearerSharesOutstanding: null,
        boardOfDirectors: null,
        companyId: null,
        constitutiveDocumentPassed: null,
        contactEmail: null,
        contactFax: null,
        countriesOfPrimaryBusinessOperations: null,
        countryCode: null,
        companyAllowsBearerShares: null,
        doingBusinessAsName: null,
        emailAddress: null,
        financialConditionsPassed: null,
        fundingSources: null,
        holdClientFunds: null,
        homeBasedBusiness: null,
        incorporationAddress: {
            fullAddress: null,
        },
        incorporationCountry: null,
        incorporationDate: null,
        industryType: null,
        isInternetOnlyBusiness: null,
        isListed: null,
        isListedCitiCoveredExchange: null,
        isSpecialPurposeVehicle: null,
        isSubsidiaryOfListedEntity: null,
        italianTaxId: null,
        lawSubjectTo: null,
        materialChangeInBusinessActivity: null,
        materialChangeInBusinessActivityDetails: null,
        materialMergerDetails: null,
        materialMergers: null,
        NAICSCode: null,
        natureOfBusiness: null,
        nonCoopTaxJurisdictionsforFrance: null,
        numberOfEmployees: null,
        numberofLocationsOrBranches: null,
        paymentIntermediaryCheckPassed: null,
        phoneNumber: null,
        primaryAddress: {
            fullAddress: null,
        },
        primaryWebsite: null,
        primaryWebsiteCheckPassed: null,
        prohibitedAccountUseCheckPassed: null,
        prohibitedRevenueSourceCheckPassed: null,
        registeredAddress: {
            fullAddress: null,
        },
        revenueCurrency: null,
        revenueSources: null,
        romanianFiscalRegistrationCertificatePassed: null,
        sanctionsCountryChecksPassed: null,
        sanctionsScreeningPassed: null,
        siteVisitCompleted: null,
        taxId: null,
        taxResidenceCountry: null,
        type: null,
        vatId: null,
    };

    const [completion, setCompletion] = useState(0);
    const [errors, setErrors] = useState({} as { [key: string]: string });
    const [structure, setStructure] = useState(company);

    useEffect(() => {
        getValidation(structure);
    }, []);

    const getValidation = async (src: CompanyData) => {
        setErrors({});
        const rules = await validateCompany(src, 'GB')

        console.log(rules)
        const complete = isNaN(rules.completion) ? 0 : rules.completion * 100;
        setCompletion(complete);
        setErrors(rules.errors);
    };

    const renderFeedback = () => {
        const errorFields = errors ? Object.keys(errors) : [];

        if (errorFields.length > 0) {
            const errorList = errorFields.map((field: string, count: number) => {
                return <li key={`error-${count}`}>{errors[field]}</li>
            });

            return <ul style={{ listStyle: 'none' }}>{errorList}</ul>
        } else if (completion === 1) {
            return <h3>Congratulations!</h3>
        }
    }


    const processFile = () => {
        let file;
        const fileInput = document.querySelector('#myFile') as newFile;
        if (fileInput) {
            file = fileInput.files[0];
        }

        if (file) {
            const reader = new FileReader();
            reader.readAsText(file);

            reader.onload = async function (event) {
                const rulesList = [] as any;
                const csv = event?.target?.result || '';

                const rows = (csv as string).split('\n');
                let cols;

                for (let i = 1; i < rows.length; i++) {

                    // rows.map((row, i) => {
                    cols = rows[i].split('\t');

                    if (cols[2] !== '{}') {
                        const rule = {
                            [cols[1]]: JSON.parse(cols[2])
                        };
                        console.log(rule)
                        rulesList.push(rule);
                        rulesList.push();
                    }
                }

                rulesList.map(async (rule: any, count: number) => {
                    const ruleAddFunc = await addRule(rule);
                    return ruleAddFunc;
                });
            }
        }
    }

    return (
        <MainSt>
            <input type="file" id="myFile" />
            <button onClick={processFile}>Process</button>

            <div style={{ display: 'flex', flexGrow: 1, width: '100%', justifyContent: 'space-around' }}>
                <div style={{ border: '1px solid #000', padding: '10px 30px 30px 30px' }}>
                    <ReactJson
                        name={'company'}
                        src={structure}
                        enableClipboard={false}
                        onEdit={(props: InteractionProps) => getValidation(props.updated_src as CompanyData)}
                        onAdd={(props: InteractionProps) => getValidation(props.updated_src as CompanyData)}
                        style={{ height: '80vh', fontSize: '1.4em', overflow: 'auto' }}
                    />
                </div>
                <div style={{ textAlign: 'center' }}>
                    <h2>{completion}%</h2>
                    {renderFeedback()}
                </div>
            </div>
        </MainSt>
    );
}

export default SetupProgress;
