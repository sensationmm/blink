import React, { useState } from "react";
import { Redirect, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { prettify } from 'validate.js';

import ScreeningStatus from '../components/screening-status';
import Icon from '../components/icon';
import ActionBar from '../components/action-bar';
import Stats from '../components/stat';
import Box from '../layout/box';
import Blocks from '../layout/blocks';
import Accordion from '../components/accordion';
import capitalize from '../utils/functions/capitalize';
import getByValue from '../utils/functions/getByValue';
import getValue from '../utils/functions/getValue';
import IconTitle from '../components/icon-title';
import FormCheckbox from '../components/form-checkbox';
import Grid from '../layout/grid';
import FlexRowGrid from '../layout/flex-row-grid';
import Button from '../components/button';
import Actions from '../layout/actions';
import { blinkMarketList, blinkMarkets } from '../utils/config/blink-markets';
import { editField as apiEditField } from '../utils/validation/request';
import { editField as saveEditField, setCompletion, setErrors } from '../redux/actions/screening';
import { showLoader, hideLoader } from '../redux/actions/loader';
import { onGetValidation } from './CompanyStructure';

import CompanyIcon from '../svg/company-icon.svg';
import PersonIcon from '../svg/individual-icon.svg';
import IconSearch from '../svg/icon-search.svg';
import IconLocation from '../svg/icon-location.svg';
import IconTarget from '../svg/icon-target.svg';
import ArrowRight from '../svg/arrow-right.svg';

import * as MainStyled from "../components/styles";
import MissingField from '../components/missing-field';

import * as Styled from './missing-data.styles';
import { TermsAccept } from './my-documents.styles';

const MissingData = (props: any) => {
    const {
        company,
        companyStructure,
        ownershipThreshold,
        validation,
        saveEditField,
        showLoader,
        hideLoader,
        setCompletion,
        setErrors,
        markets,
        currentUser
    } = props;

    const [showEmployeeConfirm, setShowEmployeeConfirm] = useState(false);
    const [employeeConfirmed, setEmployeeConfirmed] = useState(false);

    if (!company || !companyStructure || markets.length === 0) {
        return <Redirect to="/search" />;
    } else if (!validation.company || !validation.company.completion) {
        return <Redirect to="/company-structure" />;
    }

    const countryCompletion = Object.keys(validation.company.completion)
        .map((item: any) => validation.company.completion[item].passed)
        .reduce((total, current) => {
            if (current) {
                return total + current;
            } else {
                return total;
            }
        });

    const countryTotal = Object.keys(validation.company.completion)
        .map((item: any) => validation.company.completion[item].total)
        .reduce((total, current) => {
            if (current) {
                return total + current;
            } else {
                return total;
            }
        });

    const onEditField = async (field: string, value: any, docId: any) => {
        if (value !== undefined && value !== '') {
            showLoader('Saving');

            const res = await apiEditField(docId || props.companyStructure.docId, field, value, currentUser);
            console.log('onEditField', res)

            hideLoader();
        }
    }

    const getValidation = () => {
        onGetValidation(
            showLoader,
            setErrors,
            companyStructure,
            setCompletion,
            hideLoader,
            props.history.push,
            '/company-completion',
            ownershipThreshold,
            markets
        );
    };

    const shareholders = companyStructure.distinctShareholders.filter((shareholder: any) => shareholder.totalShareholding > ownershipThreshold && getValue(shareholder.shareholderType) === 'P');

    const companyInCountryRequirements = ((countryTotal - validation.company.completion.Core.total) - (countryCompletion - validation.company.completion.Core.passed));
    const companyKYC = Object.keys(validation.company.errors.Core).length;

    const sanitizeError = (err: string, label: string) => {
        let error = String(err);

        error = error.replace(`${label} is`, '').replace(label, '');
        error = capitalize(error.trim());

        return error;
    }

    const shAndOff = shareholders.concat(companyStructure.officers);

    return (
        <MainStyled.MainSt>
            <ScreeningStatus
                company={getValue(companyStructure.name)}
                country={getValue(companyStructure.incorporationCountry)}
            />

            <MainStyled.ContentNarrow>
                <Blocks>
                    <Box shadowed>
                        <Accordion
                            header={
                                <Styled.AccordionHeader>
                                    <Styled.Label><Icon icon={CompanyIcon} size={'small'} />{getValue(companyStructure.name)}</Styled.Label>

                                    <Stats list={[
                                        {
                                            label: 'Screening',
                                            icon: IconTarget,
                                            value: 5,
                                        },
                                        {
                                            label: 'In-Country requirements',
                                            icon: IconLocation,
                                            value: companyInCountryRequirements,
                                        },
                                        {
                                            label: 'KYC',
                                            icon: IconSearch,
                                            value: companyKYC,
                                        }
                                    ]} />
                                </Styled.AccordionHeader>
                            }
                            content={
                                <Blocks>
                                    {companyKYC > 0 &&
                                        <Blocks gutter={'small'}>
                                            <IconTitle title={'KYC'} icon={IconSearch} />
                                            <FlexRowGrid
                                                cols={2}
                                                component={MissingField}
                                                content={validation.company.errors.Core && Object.keys(validation.company.errors.Core).map(key => {
                                                    const label = capitalize(prettify(key));
                                                    const msg = sanitizeError(validation.company.errors.Core[key].value, label);

                                                    const valueMissing = validation.company.errors.Core[key].value !== undefined;
                                                    const sourceMissing = sanitizeError(validation.company.errors.Core[key].source, label);
                                                    const certificationMissing = sanitizeError(validation.company.errors.Core[key].certification, label);

                                                    // if (companyStructure[key]) {
                                                    //     msg += ` (found: ${companyStructure[key]})`;
                                                    // }

                                                    let sanitizedKey = key.replace('.value', '');
                                                    let value = getValue(companyStructure[sanitizedKey]) || '';
                                                    let saveValue: any;

                                                    if (value === '') {
                                                        const parts = key.split(".");
                                                        if (parts.length === 2 && companyStructure[parts[0]] && companyStructure[parts[0]][parts[1]]) {
                                                            value = companyStructure[parts[0]][parts[1]]?.value;
                                                            sanitizedKey = parts[0];
                                                            saveValue = companyStructure[parts[0]]
                                                        }
                                                    }

                                                   
                                                    return {
                                                        stateKey: `${key}.value`,
                                                        label: label.replace(' value', ''),
                                                        placeholder: msg,
                                                        onChange: saveEditField,
                                                        onBlur: () => {
                                                            onEditField(
                                                            sanitizedKey,
                                                            companyStructure[sanitizedKey] || saveValue,
                                                            companyStructure.docId,
                                                        )},
                                                        value,
                                                        missingValue: valueMissing,
                                                        missingSource: sourceMissing,
                                                        missingCertification: certificationMissing,
                                                    }
                                                })}
                                            />
                                        </Blocks>
                                    }

                                    <Blocks gutter={'small'}>
                                        <IconTitle title={'Screening'} icon={IconTarget} />
                                        <Grid
                                            labels={['AML Watchlist', 'Sanctions Screening', 'AML Red Flag List', 'Adverse Media', 'Local Lists']}
                                            content={[
                                                {
                                                    values: [
                                                        getValue(companyStructure.AMLWatchListPassed),
                                                        getValue(companyStructure.sanctionsScreeningPassed),
                                                        getValue(companyStructure.AMLRedFlagListPassed),
                                                        getValue(companyStructure.adverseMediaChecksPassed),
                                                        getValue(companyStructure.LocalListCheckPassed),
                                                    ]
                                                }
                                            ]}
                                            rowHeaderWidth={0}
                                        />
                                    </Blocks>

                                    {companyInCountryRequirements > 0 &&
                                        <Blocks gutter={'small'}>
                                            <IconTitle title={'In-Country requirements'} icon={IconLocation} />
                                            {markets
                                                .filter((market: string) => {
                                                    const marketInfo = getByValue(blinkMarkets, 'code', market);
                                                    return validation.company.errors[marketInfo.code] && Object.keys(validation.company.errors[marketInfo.code]).length > 0;
                                                })
                                                .map((market: string, count: number) => {
                                                    const marketInfo = getByValue(blinkMarkets, 'code', market);
                                                    return (
                                                        <Accordion
                                                            key={`accordion-${count}`}
                                                            header={
                                                                <Styled.AccordionHeader>
                                                                    <IconTitle title={marketInfo.name} icon={marketInfo.flag} />
                                                                </Styled.AccordionHeader>
                                                            }
                                                            content={
                                                                <FlexRowGrid
                                                                    cols={2}
                                                                    component={MissingField}
                                                                    content={Object.keys(validation.company.errors[marketInfo.code])
                                                                        .map(key => {
                                                                            const label = capitalize(prettify(key));
                                                                            const msg = sanitizeError(validation.company.errors[marketInfo.code][key].value, label);

                                                                            const sanitizedKey = key.replace('.value', '');

                                                                            const valueMissing = validation.company.errors[marketInfo.code][key].value !== undefined;
                                                                            const sourceMissing = sanitizeError(validation.company.errors[marketInfo.code][key].source, label);
                                                                            const certificationMissing = sanitizeError(validation.company.errors[marketInfo.code][key].certification, label);

                                                                            return {
                                                                                stateKey: `${key}.value`,
                                                                                label: label.replace(' value', ''),
                                                                                placeholder: msg,
                                                                                onChange: saveEditField,
                                                                                onBlur: () => onEditField(
                                                                                    sanitizedKey,
                                                                                    companyStructure[sanitizedKey],
                                                                                    companyStructure.docId
                                                                                ),
                                                                                value: getValue(companyStructure[sanitizedKey]) || '',
                                                                                missingValue: valueMissing,
                                                                                missingSource: sourceMissing,
                                                                                missingCertification: certificationMissing,
                                                                            }
                                                                        })
                                                                    }
                                                                />
                                                            }
                                                        />
                                                    )
                                                })}
                                        </Blocks>
                                    }
                                </Blocks>
                            }
                        />
                    </Box>

                    {shAndOff.filter((shareholder: any) => validation[shareholder.docId]).map((shareholder: any, count: number) => {
                        const marketCompletion = Object.keys(validation[shareholder.docId].completion)
                            .filter((x, i, a) => a.indexOf(x) === i)
                            .map((item: any) => validation[shareholder.docId].completion[item].passed)
                            .reduce((total, current) => {
                                if (current) {
                                    return total + current;
                                } else {
                                    return total;
                                }
                            });

                        const marketTotal = Object.keys(validation[shareholder.docId].completion)
                            .filter((x, i, a) => a.indexOf(x) === i)
                            .map((item: any) => validation[shareholder.docId].completion[item].total)
                            .reduce((total, current) => {
                                if (current) {
                                    return total + current;
                                } else {
                                    return total;
                                }
                            });

                        const countInCountryRequirements = ((marketTotal - validation[shareholder.docId].completion.Core.total) - (marketCompletion - validation[shareholder.docId].completion.Core.passed));
                        const countKYC = validation[shareholder.docId].errors.Core && Object.keys(validation[shareholder.docId].errors.Core).length;

                        return (
                            <Box shadowed key={`shareholder-${count}`}>
                                <Accordion
                                    header={
                                        <Styled.AccordionHeader>
                                            <Styled.Label><Icon icon={PersonIcon} size={'small'} style={'person'} />{getValue(shareholder.name)}</Styled.Label>
                                            <Stats list={[
                                                {
                                                    label: 'Screening',
                                                    icon: IconTarget,
                                                    value: 5
                                                },
                                                {
                                                    label: 'In-Country requirements',
                                                    icon: IconLocation,
                                                    value: countInCountryRequirements,
                                                },
                                                {
                                                    label: 'KYC',
                                                    icon: IconSearch,
                                                    value: countKYC,
                                                }
                                            ]} />
                                        </Styled.AccordionHeader>
                                    }
                                    content={
                                        <Blocks>
                                            {countKYC > 0 &&
                                                <Blocks gutter={'small'}>
                                                    <IconTitle title={'KYC'} icon={IconSearch} />
                                                    <FlexRowGrid
                                                        cols={2}
                                                        component={MissingField}
                                                        content={validation[shareholder.docId].errors.Core && Object.keys(validation[shareholder.docId].errors.Core).map(key => {
                                                            const label = capitalize(prettify(key));
                                                            const msg = sanitizeError(validation[shareholder.docId].errors.Core[key].value, label);

                                                            const sanitizedKey = key.replace('.value', '');

                                                            const valueMissing = validation[shareholder.docId].errors.Core[key].value !== undefined;
                                                            const sourceMissing = sanitizeError(validation[shareholder.docId].errors.Core[key].source, label);
                                                            const certificationMissing = sanitizeError(validation[shareholder.docId].errors.Core[key].certification, label);

                                                            return {
                                                                stateKey: `${key}.value`,
                                                                label: label.replace(' value', ''),
                                                                placeholder: msg,
                                                                onChange: (field: any, value: any) => saveEditField(field, value, "distinctShareholders", shareholder.docId),
                                                                onBlur: () => onEditField(
                                                                    key,
                                                                    shareholder[sanitizedKey],
                                                                    shareholder.docId
                                                                ),
                                                                value: getValue(shareholder[sanitizedKey]) || '',
                                                                missingValue: valueMissing,
                                                                missingSource: sourceMissing,
                                                                missingCertification: certificationMissing,
                                                            }
                                                        })}
                                                    />
                                                </Blocks>
                                            }

                                            <Blocks gutter={'small'}>
                                                <IconTitle title={'Screening'} icon={IconTarget} />
                                                <Grid
                                                    labels={['AML Watchlist', 'Sanctions Screening', 'AML Red Flag List', 'Adverse Media', 'Local Lists', 'Senior Public Figure']}
                                                    content={[
                                                        {
                                                            values: [
                                                                shareholder.AMLWatchListPassed,
                                                                shareholder.sanctionsScreeningPassed,
                                                                shareholder.AMLRedFlagListPassed,
                                                                shareholder.adverseMediaChecksPassed,
                                                                shareholder.LocalListCheckPassed,
                                                                shareholder.seniorPublicFigure,
                                                            ]
                                                        }
                                                    ]}
                                                    rowHeaderWidth={0}
                                                />
                                            </Blocks>

                                            {countInCountryRequirements > 0 &&
                                                <Blocks gutter={'small'}>
                                                    <IconTitle title={'In-Country requirements'} icon={IconLocation} />
                                                    {markets
                                                        .filter((market: string) => {
                                                            const marketInfo = getByValue(blinkMarkets, 'code', market);
                                                            return validation[shareholder.docId].errors[marketInfo.code] && Object.keys(validation[shareholder.docId].errors[marketInfo.code]).length > 0;
                                                        })
                                                        .map((market: string, count: number) => {
                                                            const marketInfo = getByValue(blinkMarkets, 'code', market);
                                                            return (
                                                                <Accordion
                                                                    key={`accordion-${count}`}
                                                                    header={
                                                                        <Styled.AccordionHeader>
                                                                            <IconTitle title={marketInfo.name} icon={marketInfo.flag} />
                                                                        </Styled.AccordionHeader>
                                                                    }
                                                                    content={
                                                                        <FlexRowGrid
                                                                            cols={2}
                                                                            component={MissingField}
                                                                            content={Object.keys(validation[shareholder.docId].errors[marketInfo.code])
                                                                                .map(key => {
                                                                                    const label = capitalize(prettify(key));
                                                                                    const msg = sanitizeError(validation[shareholder.docId].errors[marketInfo.code][key].value, label);

                                                                                    const sanitizedKey = key.replace('.value', '');

                                                                                    const valueMissing = validation[shareholder.docId].errors[marketInfo.code][key].value !== undefined;
                                                                                    const sourceMissing = sanitizeError(validation[shareholder.docId].errors[marketInfo.code][key].source, label);
                                                                                    const certificationMissing = sanitizeError(validation[shareholder.docId].errors[marketInfo.code][key].certification, label);

                                                                                    return {
                                                                                        stateKey: `${key}.value`,
                                                                                        label: label.replace(' value', ''),
                                                                                        placeholder: msg,
                                                                                        onChange: (field: any, value: any) => saveEditField(field, value, "distinctShareholders", shareholder.docId),
                                                                                        onBlur: () => onEditField(
                                                                                            sanitizedKey,
                                                                                            shareholder[sanitizedKey],
                                                                                            shareholder.docId
                                                                                        ),
                                                                                        value: getValue(shareholder[sanitizedKey]) || '',
                                                                                        missingValue: valueMissing,
                                                                                        missingSource: sourceMissing,
                                                                                        missingCertification: certificationMissing,
                                                                                    }
                                                                                })
                                                                            }
                                                                        />
                                                                    }
                                                                />
                                                            )
                                                        })}
                                                </Blocks>
                                            }
                                        </Blocks>
                                    }
                                />
                            </Box>
                        )
                    })}
                </Blocks>

                <Actions>
                    <Button onClick={() => setShowEmployeeConfirm(true)} label={'Return check with new info'} icon={ArrowRight} />
                </Actions>
            </MainStyled.ContentNarrow>

            <ActionBar
                labelPrimary={'Confirm'}
                actionPrimary={getValidation}
                disabledPrimary={!employeeConfirmed}
                header={<TermsAccept>
                    I confirm as a Blink employee this information is accurate based on the verifiable sources in accordance
                    with existing policies and standards
                    <FormCheckbox style={'confirm'} onChange={() => setEmployeeConfirmed(!employeeConfirmed)} checked={employeeConfirmed} />
                </TermsAccept>}
                showHeader={true}
                hidden={!showEmployeeConfirm}
            />
        </MainStyled.MainSt>
    )
}

const mapStateToProps = (state: any) => ({
    markets: state.screening.markets,
    company: state.screening.company,
    companyStructure: state.screening.companyStructure,
    ownershipThreshold: state.screening.ownershipThreshold,
    validation: state.screening.validation,
    currentUser: state.auth.user.localId
});

const actions = { saveEditField, showLoader, hideLoader, setCompletion, setErrors };

export const RawComponent = MissingData;

export default connect(mapStateToProps, actions)(withRouter(MissingData));
