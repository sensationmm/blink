import React from "react";
import { Redirect, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import getByValue from '../utils/functions/getByValue';
import { blinkMarketList, blinkMarkets } from '../utils/config/blink-markets';
import { MainSt } from "../components/styles";
import ScreeningStatus from '../components/screening-status';
import Button from '../components/button';
import Actions from '../layout/actions';
import ProgressBar from '../components/progress-bar';
import Icon from '../components/icon';
import Box from '../layout/box';
import Blocks from '../layout/blocks';
import Grid from '../layout/grid';

import CompanyIcon from '../svg/company-icon.svg';
import PersonIcon from '../svg/individual-icon.svg';
import IconSearch from '../svg/icon-search.svg';
import IconLocation from '../svg/icon-location.svg';
import IconTarget from '../svg/icon-target.svg';

const CompanyReadiness = (props: any) => {
    const {
        company,
        companyStructure,
        validation,
        ownershipThreshold
    } = props;

    if (!company || !companyStructure) {
        return <Redirect to="/search" />;
    } else if (!validation) {
        return <Redirect to="/company-structure" />;
    }

    const { completion, errors } = validation;

    const renderFeedback = () => {
        const errorFields = errors ? Object.keys(errors) : [];

        if (errorFields.length > 0) {
            const errorList = errorFields.map((field: string, count: number) => {
                return <li key={`error-${count}`}>{errors[field]}</li>
            });

            return <ul style={{ listStyle: 'none' }}>{errorList}</ul>
        } else if (completion.all.passed === completion.all.total) {
            return <h3>Congratulations!</h3>
        }
    }

    const shareholders = companyStructure.distinctShareholders.filter((shareholder: any) => shareholder.totalShareholding > ownershipThreshold);

    return (
        <MainSt>
            <ScreeningStatus
                company={companyStructure.name}
                country={companyStructure.incorporationCountry}
            />

            <Blocks>
                <Box title={'KYC'} icon={IconSearch} paddedLarge>
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

                <Box title={'Screening'} icon={IconTarget} paddedLarge>
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

                <Box title={'In-Country Requirements'} icon={IconLocation} paddedLarge>
                    <Blocks>
                        {blinkMarketList.filter(item => { return completion[item].total }).map((market: any, count: number) => {
                            const { passed, total } = completion[market];
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
                {/* {renderFeedback()} */}
            </Blocks>

            <Actions>
                <Button onClick={() => props.history.push('/missing-data')} label={'Next'} />
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

export const RawComponent = CompanyReadiness;

export default connect(mapStateToProps)(withRouter(CompanyReadiness));
