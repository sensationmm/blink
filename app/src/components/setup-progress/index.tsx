
import React, { useState, useEffect } from "react";
import { addRule, validateCompany } from '../../utils/validation/request';
import { MainSt } from "../styles";
import ReactJson, { InteractionProps } from 'react-json-view'
import { withRouter } from "react-router-dom";

import { CompanyData } from '../../utils/validation/request';
import { blinkMarketList, blinkMarkets } from '../../utils/config/blink-markets';
import getByValue from '../../utils/functions/getByValue';
import { requestCompanyUBOStructure } from '../../utils/generic/request';

import ProgressBar from '../progress-bar';

interface newFile extends Element {
    files: Array<Blob>;
}
type market = 'Core' | 'GB' | 'DE' | 'FR' | 'RO' | 'IT' | 'SE';
type indexedObject = { [key: string]: any };

const SetupProgress = (props: any) => {
    const company = {
        name: null,
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

    const [completion, setCompletion] = useState({} as { [key: string]: indexedObject });
    const [errors, setErrors] = useState({} as { [key: string]: string });
    const [structure, setStructure] = useState();

    const go = async () => {
        const { match: { params: { companyId, countryCode } } } = props;
        const requestedCompany = await requestCompanyUBOStructure(companyId || "10103078", 'GB');
        setStructure(requestedCompany);
    }
    if (!structure) {
        go()
    }

    useEffect(() => {
        if (structure) {
            getValidation(structure);
        }
    }, [structure]);

    const getValidation = async (src: CompanyData) => {
        setErrors({});
        const rules = await validateCompany(src, 'GB')

        console.log(rules)
        // const complete = isNaN(rules.Core.completion) ? 0 : rules.Core.completion * 100;

        const marketCompletion = {
            Core: {} as indexedObject,
            GB: {} as indexedObject,
            DE: {} as indexedObject,
            FR: {} as indexedObject,
            RO: {} as indexedObject,
            IT: {} as indexedObject,
            SE: {} as indexedObject,
        };

        Object.keys(rules.company).forEach((rule) => marketCompletion[rule as market] = { passed: rules.company[rule].passed, total: rules.company[rule].total });
        setCompletion(marketCompletion);
        setErrors(rules.company.Core.errors);
    };

    const renderFeedback = () => {
        const errorFields = errors ? Object.keys(errors) : [];

        if (errorFields.length > 0) {
            const errorList = errorFields.map((field: string, count: number) => {
                return <li key={`error-${count}`}>{errors[field]}</li>
            });

            return <ul style={{ listStyle: 'none' }}>{errorList}</ul>
        } else if (completion.Core.passed === completion.Core.total) {
            return <h3>Congratulations!</h3>
        }
    }

    return (
        <MainSt>
            <div style={{ display: 'flex', flexGrow: 1, width: '100%', justifyContent: 'space-around' }}>
                <div style={{ width: '45%', border: '1px solid #000', padding: '10px 30px 30px 30px' }}>
                    <ReactJson
                        name={'company'}
                        src={structure}
                        enableClipboard={false}
                        onEdit={(props: InteractionProps) => getValidation(props.updated_src as CompanyData)}
                        onAdd={(props: InteractionProps) => getValidation(props.updated_src as CompanyData)}
                        style={{ height: '80vh', fontSize: '1.4em', overflow: 'auto' }}
                        collapsed={1}
                    />
                </div>
                <div style={{ width: '45%', textAlign: 'center' }}>
                    {completion.Core && <div>
                        <h2>{structure.name}</h2>

                        <ProgressBar large value={completion['Core'].passed} total={completion['Core'].total} />

                        {
                            blinkMarketList.map((market: any, count: number) => {
                                const { passed, total } = completion[market];

                                return <ProgressBar label={getByValue(blinkMarkets, 'code', market).name} value={passed} total={total} />
                            })
                        }
                        {renderFeedback()}
                    </div>}
                </div>
            </div>
        </MainSt>
    );
}

export default withRouter(SetupProgress)
