import React from 'react';

import ProgressBar from '../progress-bar';
import Icon from '../icon';
import Box from '../../layout/box';
import Blocks from '../../layout/blocks';
import Grid from '../../layout/grid';

import CompanyIcon from '../../svg/company-icon.svg';
import PersonIcon from '../../svg/individual-icon.svg';
import IconSearch from '../../svg/icon-search.svg';
import IconLocation from '../../svg/icon-location.svg';
import IconTarget from '../../svg/icon-target.svg';

import getByValue from '../../utils/functions/getByValue';
import getValue from '../../utils/functions/getValue';
import { blinkMarketList, blinkMarkets } from '../../utils/config/blink-markets';

import * as Styled from './styles';

interface ReadinessProps {
    companyStructure: any;
    ownershipThreshold: any;
    shareholders: any;
    validation: any;
}

const Readiness: React.FC<ReadinessProps> = ({
    companyStructure,
    ownershipThreshold,
    shareholders,
    validation,
}) => {
    return (
        <Blocks>
            <Box title={'KYC'} icon={IconSearch} paddedLarge shadowed>
                <Blocks>
                    <ProgressBar
                        label={getValue(companyStructure.name)}
                        icon={<Icon icon={CompanyIcon} size={'small'} />}
                        value={validation.company.completion['Core'].passed}
                        total={validation.company.completion['Core'].total}
                        stacked
                    />

                    {shareholders.map((shareholder: any, count: number) => {
                        if (!validation[shareholder.docId]) {
                            return (
                                <Styled.NotRequired>
                                    <Styled.Header>
                                        <Icon icon={PersonIcon} size={'small'} style={'person'} />
                                        <div>{getValue(shareholder.name)}</div>
                                    </Styled.Header>
                                    <Styled.Message>UBO Checks not required</Styled.Message>
                                </Styled.NotRequired>
                            )
                        }

                        return (
                            <ProgressBar
                                key={`shareholder-${count}`}
                                label={getValue(shareholder.name)}
                                icon={<Icon icon={PersonIcon} size={'small'} style={'person'} />}
                                value={validation[shareholder.docId].completion['Core'].passed}
                                total={validation[shareholder.docId].completion['Core'].total}
                                stacked
                            />
                        )
                    })}
                </Blocks>
            </Box>

            <Box title={'Screening'} icon={IconTarget} paddedLarge shadowed>
                <Grid
                    labels={['AML Watchlist', 'Sanctions Screening', 'AML Red Flag List', 'Adverse Media', 'Senior Public Figure']}
                    content={[
                        {
                            label: getValue(companyStructure.name),
                            icon: <Icon icon={CompanyIcon} size={'small'} style={'company'} />,
                            values: [
                                getValue(companyStructure.AMLWatchListPassed),
                                getValue(companyStructure.sanctionsScreeningPassed),
                                getValue(companyStructure.AMLRedFlagListPassed),
                                getValue(companyStructure.adverseMediaChecksPassed),
                                null,
                            ]
                        },
                        ...shareholders.filter((shareholder: any) => validation[shareholder.docId]).map((shareholder: any, count: number) => {
                            return {
                                label: getValue(shareholder.name),
                                icon: <Icon icon={PersonIcon} size={'small'} style={'person'} />,
                                values: [
                                    getValue(shareholder.AMLWatchListPassed),
                                    getValue(shareholder.sanctionsScreeningPassed),
                                    getValue(shareholder.AMLRedFlagListPassed),
                                    getValue(shareholder.adverseMediaChecksPassed),
                                    getValue(shareholder.seniorPublicFigure),
                                ]
                            }
                        })
                    ]}
                    rowHeaderWidth={30}
                />
            </Box>

            <Box title={'In-Country Requirements'} icon={IconLocation} paddedLarge shadowed>
                <Blocks>
                    {blinkMarketList
                        .filter(market => { return !getByValue(blinkMarkets, 'code', market).disabled })
                        .map((market: any, count: number) => {
                            const { passed = 0, total = 0 } = validation.company.completion[market];
                            const marketInfo = getByValue(blinkMarkets, 'code', market);

                            return (
                                <ProgressBar
                                    key={`bar-${count}`}
                                    label={marketInfo.name}
                                    value={passed + validation.company.completion['Core'].passed}
                                    total={total + validation.company.completion['Core'].total}
                                    icon={marketInfo.flag}
                                />
                            )
                        })}
                </Blocks>
            </Box>
        </Blocks>
    )
}

export default Readiness;
