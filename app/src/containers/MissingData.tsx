import React from "react";
import { Redirect, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { prettify } from 'validate.js';

import ScreeningStatus from '../components/screening-status';
import Icon from '../components/icon';
import Stats from '../components/stat';
import Box from '../layout/box';
import Blocks from '../layout/blocks';
import Accordion from '../components/accordion';
import capitalize from '../utils/functions/capitalize';
import IconTitle from '../components/icon-title';
import Grid from '../layout/grid';
import FlexRowGrid from '../layout/flex-row-grid';
import Button from '../components/button';
import Actions from '../layout/actions';
import { blinkMarketList, blinkMarkets, marketType } from '../utils/config/blink-markets';
import { editField as apiEditField } from '../utils/validation/request';
import { editField as saveEditField, setCompletion, setErrors } from '../redux/actions/screening';
import { showLoader, hideLoader } from '../redux/actions/loader';
import { onGetValidation } from './CompanyStructure';

import CompanyIcon from '../svg/company-icon.svg';
import PersonIcon from '../svg/individual-icon.svg';
import IconSearch from '../svg/icon-search.svg';
import IconLocation from '../svg/icon-location.svg';
import IconTarget from '../svg/icon-target.svg';

import { MainSt } from "../components/styles";
import FormInput from '../components/form-input';

import * as Styled from './missing-data.styles';

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
    } = props;

    if (!company || !companyStructure) {
        return <Redirect to="/search" />;
    } else if (!validation.completion) {
        return <Redirect to="/company-structure" />;
    }

    const countryCompletion = Object.keys(validation.completion)
        .map((item: any) => validation.completion[item].passed)
        .reduce((total, current) => {
            if (current) {
                return total + current;
            } else {
                return total;
            }
        });

    const countryTotal = Object.keys(validation.completion)
        .map((item: any) => validation.completion[item].total)
        .reduce((total, current) => {
            if (current) {
                return total + current;
            } else {
                return total;
            }
        });

    const onEditField = async (field: string, value: any) => {
        if (value !== undefined && value !== '') {
            showLoader('Saving');

            const res = await apiEditField(props.companyStructure.docId, field, value);
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
            '/contact-client'
        );
    };

    const shareholders = companyStructure.distinctShareholders.filter((shareholder: any) => shareholder.totalShareholding > ownershipThreshold);

    return (
        <MainSt>
            <ScreeningStatus
                company={companyStructure.name}
                country={companyStructure.incorporationCountry}
            />

            <Blocks>
                <Box shadowed>
                    <Accordion
                        header={
                            <Styled.AccordionHeader>
                                <Styled.Label><Icon icon={CompanyIcon} size={'small'} />{companyStructure.name}</Styled.Label>

                                <Stats list={[
                                    {
                                        label: 'Screening',
                                        icon: IconTarget,
                                        value: 5,
                                    },
                                    {
                                        label: 'In-Country requirements',
                                        icon: IconLocation,
                                        value: ((countryTotal - validation.completion.Core.total) - (countryCompletion - validation.completion.Core.passed)),
                                    },
                                    {
                                        label: 'KYC',
                                        icon: IconSearch,
                                        value: validation.completion.Core.total - validation.completion.Core.passed,
                                    }
                                ]} />
                            </Styled.AccordionHeader>
                        }
                        content={
                            <Blocks>
                                <Blocks gutter={'small'}>
                                    <IconTitle title={'KYC'} icon={IconSearch} />
                                    <FlexRowGrid
                                        cols={2}
                                        component={FormInput}
                                        content={validation.errors.Core && Object.keys(validation.errors.Core).map(key => {
                                            const label = capitalize(prettify(key));
                                            let msg = String(validation.errors.Core[key]);
                                            msg = capitalize(msg.replace(label, '').trim());

                                            // if (companyStructure[key]) {
                                            //     msg += ` (found: ${companyStructure[key]})`;
                                            // }

                                            return {
                                                stateKey: key,
                                                label,
                                                placeholder: msg,
                                                onChange: saveEditField,
                                                onBlur: onEditField,
                                                value: companyStructure[key] ? companyStructure[key] : '',
                                            }
                                        })}
                                    />
                                </Blocks>

                                <Blocks gutter={'small'}>
                                    <IconTitle title={'Screening'} icon={IconTarget} />
                                    <Grid
                                        labels={['AML Watchlist', 'Sanctions Screening', 'AML Red Flag List', 'Adverse Media', 'Senior Public Figure']}
                                        content={[
                                            {
                                                values: [
                                                    companyStructure.AMLWatchListPassed,
                                                    companyStructure.sanctionsScreeningPassed,
                                                    companyStructure.AMLRedFlagListPassed,
                                                    companyStructure.adverseMediaChecksPassed,
                                                    null,
                                                ]
                                            }
                                        ]}
                                        rowHeaderWidth={0}
                                    />
                                </Blocks>

                                <Blocks gutter={'small'}>
                                    <IconTitle title={'In-Country requirements'} icon={IconLocation} />
                                    {Object.keys(blinkMarketList)
                                        .filter(market => {
                                            const marketInfo = blinkMarkets[market as any];
                                            return validation.errors[marketInfo.code] && Object.keys(validation.errors[marketInfo.code]).length > 0;
                                        })
                                        .map((market, count) => {
                                            const marketInfo = blinkMarkets[market as any];
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
                                                            component={FormInput}
                                                            content={Object.keys(validation.errors[marketInfo.code])
                                                                .map(key => {
                                                                    const label = capitalize(prettify(key));
                                                                    let msg = String(validation.errors[marketInfo.code][key]);
                                                                    msg = capitalize(msg.replace(label, '').trim());

                                                                    return {
                                                                        stateKey: key,
                                                                        label,
                                                                        placeholder: msg,
                                                                        onChange: saveEditField,
                                                                        onBlur: onEditField,
                                                                        value: companyStructure[key] ? companyStructure[key] : '',
                                                                    }
                                                                })
                                                            }
                                                        />
                                                    }
                                                />
                                            )
                                        })}
                                </Blocks>
                            </Blocks>
                        }
                    />
                </Box>

                {shareholders.map((shareholder: any, count: number) =>
                    <Box shadowed key={`shareholder-${count}`}>
                        <Styled.AccordionHeader>
                            <Styled.Label><Icon icon={PersonIcon} size={'small'} style={'person'} />{shareholder.name}</Styled.Label>
                            <Stats list={[
                                { label: 'Screening', icon: IconTarget, value: 5 },
                                { label: 'In-Country requirements', icon: IconLocation, value: 0, },
                                { label: 'KYC', icon: IconSearch, value: 0, }
                            ]} />
                        </Styled.AccordionHeader>
                    </Box>
                )}
            </Blocks>

            <Actions>
                <Button onClick={getValidation} label={'Return check with new info'} />
            </Actions>
        </MainSt>
    )
}

const mapStateToProps = (state: any) => ({
    company: state.screening.company,
    companyStructure: state.screening.companyStructure,
    ownershipThreshold: state.screening.ownershipThreshold,
    validation: state.screening.validation,
});

const actions = { saveEditField, showLoader, hideLoader, setCompletion, setErrors };

export const RawComponent = MissingData;

export default connect(mapStateToProps, actions)(withRouter(MissingData));
