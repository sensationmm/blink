import React from "react";
import { Redirect } from 'react-router-dom';
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
import { blinkMarketList, blinkMarkets, marketType } from '../utils/config/blink-markets';

import CompanyIcon from '../svg/company-icon.svg';
import PersonIcon from '../svg/individual-icon.svg';
import IconSearch from '../svg/icon-search.svg';
import IconLocation from '../svg/icon-location.svg';
import IconTarget from '../svg/icon-target.svg';

import { MainSt } from "../components/styles";
import { InputSt } from '../components/styles';

import * as Styled from './missing-data.styles';

const MissingData = (props: any) => {
    const {
        company,
        companyStructure,
        ownershipThreshold,
        validation,
    } = props;

    if (!company || !companyStructure) {
        return <Redirect to="/search" />;
    } else if (!validation) {
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
                                        value: 0,
                                        total: 5
                                    },
                                    {
                                        label: 'In-Country requirements',
                                        icon: IconLocation,
                                        value: countryCompletion - validation.completion.Core.passed,
                                        total: countryTotal - validation.completion.Core.total
                                    },
                                    {
                                        label: 'KYC',
                                        icon: IconSearch,
                                        value: validation.completion.Core.passed,
                                        total: validation.completion.Core.total
                                    }
                                ]} />
                            </Styled.AccordionHeader>
                        }
                        content={
                            <Blocks>
                                <Blocks gutter={'small'}>
                                    <IconTitle title={'KYC'} icon={IconSearch} />
                                    {Object.keys(validation.errors.Core).map((key, count) => {
                                        return (
                                            <Styled.Field key={`missing-${count}`}>
                                                <InputSt
                                                    placeholder={capitalize(prettify(key))}
                                                    onChange={() => { }}
                                                    type="text"
                                                    value={company[key] ? company[key] : ''}
                                                />
                                                <Styled.Error>{validation.errors.Core[key]}</Styled.Error>
                                            </Styled.Field>
                                        )
                                    })}
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
                                    {Object.keys(blinkMarketList).map((market, count) => {
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
                                                    <div>
                                                        {
                                                            Object.keys(validation.errors[marketInfo.code])
                                                                .map((error, count) => {
                                                                    return (
                                                                        <Styled.Field key={`missing-${market}-${count}`}>
                                                                            <InputSt
                                                                                placeholder={capitalize(prettify(error))}
                                                                                onChange={() => { }}
                                                                                type="text"
                                                                                value={company[error] ? company[error] : ''}
                                                                            />
                                                                            <Styled.Error>{validation.errors[marketInfo.code][error]}</Styled.Error>
                                                                        </Styled.Field>
                                                                    )
                                                                })
                                                        }
                                                    </div>
                                                }
                                            />
                                        )
                                    })}
                                </Blocks>
                            </Blocks>
                        }
                    />
                </Box>

                {companyStructure.distinctShareholders.filter((shareholder: any) => shareholder.totalShareholding > ownershipThreshold)
                    .map((shareholder: any, count: number) =>
                        <Box shadowed key={`shareholder-${count}`}>
                            <Styled.AccordionHeader>
                                <Styled.Label><Icon icon={PersonIcon} size={'small'} style={'person'} />{shareholder.name}</Styled.Label>

                                <Stats list={[
                                    {
                                        label: 'Screening',
                                        icon: IconTarget,
                                        value: 0,
                                        total: 5
                                    },
                                    {
                                        label: 'In-Country requirements',
                                        icon: IconLocation,
                                        value: 0,
                                        total: 0,
                                    },
                                    {
                                        label: 'KYC',
                                        icon: IconSearch,
                                        value: 0,
                                        total: 0,
                                    }
                                ]} />
                            </Styled.AccordionHeader>
                        </Box>
                    )}
            </Blocks>
        </MainSt>
    )
}

const mapStateToProps = (state: any) => ({
    company: state.screening.company,
    companyStructure: state.screening.companyStructure,
    ownershipThreshold: state.screening.ownershipThreshold,
    validation: state.screening.validation,
});

export const RawComponent = MissingData;

export default connect(mapStateToProps)(MissingData);
