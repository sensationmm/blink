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
import { blinkMarketList, blinkMarkets } from '../../utils/config/blink-markets';

interface ReadinessProps {
    companyStructure: any;
    ownershipThreshold: any;
    shareholders: any;
    completion: any;
}

const Readiness: React.FC<ReadinessProps> = ({
    companyStructure,
    ownershipThreshold,
    shareholders,
    completion,
}) => {
    return (
        <Blocks>
            <Box title={'KYC'} icon={IconSearch} paddedLarge shadowed>
                <Blocks>
                    <ProgressBar
                        label={companyStructure.name}
                        icon={<Icon icon={CompanyIcon} size={'small'} />}
                        value={completion['Core'].passed}
                        total={completion['Core'].total}
                        stacked
                    />

                    {companyStructure.distinctShareholders.filter((shareholder: any) => shareholder.totalShareholding > ownershipThreshold)
                        .map((shareholder: any, count: number) =>
                            <ProgressBar
                                key={`shareholder-${count}`}
                                label={shareholder.name}
                                icon={<Icon icon={PersonIcon} size={'small'} style={'person'} />}
                                value={0}
                                total={0}
                                stacked
                            />
                        )}
                </Blocks>
            </Box>

            <Box title={'Screening'} icon={IconTarget} paddedLarge shadowed>
                <Grid
                    labels={['AML Watchlist', 'Sanctions Screening', 'AML Red Flag List', 'Adverse Media', 'Senior Public Figure']}
                    content={[
                        {
                            label: companyStructure.name,
                            icon: <Icon icon={CompanyIcon} size={'small'} style={'company'} />,
                            values: [
                                companyStructure.AMLWatchListPassed,
                                companyStructure.sanctionsScreeningPassed,
                                companyStructure.AMLRedFlagListPassed,
                                companyStructure.adverseMediaChecksPassed,
                                null,
                            ]
                        },
                        ...shareholders.map((shareholder: any, count: number) => {
                            return {
                                label: shareholder.name,
                                icon: <Icon icon={PersonIcon} size={'small'} style={'person'} />,
                                values: [false, false, false, false, false]
                            }
                        })
                    ]}
                    rowHeaderWidth={30}
                />
            </Box>

            <Box title={'In-Country Requirements'} icon={IconLocation} paddedLarge shadowed>
                <Blocks>
                    {blinkMarketList
                        // .filter(item => { return completion[item].total })
                        .map((market: any, count: number) => {
                            const { passed = 0, total = 0 } = completion[market];
                            const marketInfo = getByValue(blinkMarkets, 'code', market);

                            return (
                                <ProgressBar
                                    key={`bar-${count}`}
                                    label={marketInfo.name}
                                    value={passed + completion['Core'].passed}
                                    total={total + completion['Core'].total}
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
