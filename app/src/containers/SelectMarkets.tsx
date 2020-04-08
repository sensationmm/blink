import React, { useState } from "react";
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import classNames from 'classnames';

import SetupStatus from '../components/setup-status';
import Button from '../components/button';
import Actions from '../layout/actions';
// import Box from '../layout/box';
import FlexRowGrid from '../layout/flex-row-grid';
import capitalize from '../utils/functions/capitalize';

import { setMarkets } from '../redux/actions/screening';
import { showLoader, hideLoader } from '../redux/actions/loader';

import * as MainStyled from "../components/styles";
import * as Styled from './select-markets.styles';

import { blinkMarkets } from '../utils/config/blink-markets';

const SelectMarkets = (props: any) => {
    const {
        markets,
        setMarkets,
        history
    } = props;

    const [filter, setFilter] = useState('all');

    const regions = [...new Set(blinkMarkets.map(market => market.region))];

    const setMarket = (market: any) => {
        const marketsHold = props.markets.slice();

        const currentIndex = marketsHold.indexOf(market);

        if (currentIndex > -1) {
            marketsHold.splice(currentIndex, 1);
        } else {
            marketsHold.push(market);
        }

        setMarkets(marketsHold);
    };

    return (
        <MainStyled.MainSt>
            <SetupStatus />

            <MainStyled.ContentNarrow>
                <h1>Which countries would you like to open a Blink bank account in?</h1>

                <Styled.Filter>
                    <li className={classNames({ active: filter === 'all' })} onClick={() => setFilter('all')}>All</li>
                    {regions.map((region: string, count: number) => {
                        return <li key={`filter_${count}`} className={classNames({ active: filter === region })} onClick={() => setFilter(region)}>{capitalize(region)}</li>
                    })}
                </Styled.Filter>

                <FlexRowGrid
                    component={Styled.Market}
                    cols={4}
                    content={
                        blinkMarkets
                            .filter(market => {
                                return market.region === filter || filter === 'all'
                            })
                            .sort((a, b) => {
                                if (a.name === b.name) {
                                    return 0;
                                }
                                else {
                                    return (a.name < b.name) ? -1 : 1;
                                }
                            })
                            .map((market: any, count) => {
                                return {
                                    children: (
                                        <Styled.Inner key={`child-${count}`} onClick={() => setMarket(market.code)}>
                                            <div>
                                                <Styled.Country>{market.name}</Styled.Country>
                                                <Styled.Flag src={market.flag} alt={market.name} />
                                            </div>
                                        </Styled.Inner>
                                    ),
                                    className: classNames(
                                        { active: markets.indexOf(market.code) > -1 },
                                        { disabled: market.disabled },
                                    ),
                                };
                            })
                    }
                />

                <Actions centered>
                    <Button onClick={() => history.push('/onboarding/my-company')} disabled={markets.length === 0} />
                </Actions>

            </MainStyled.ContentNarrow>
        </MainStyled.MainSt>
    )
}

const mapStateToProps = (state: any) => ({
    markets: state.screening.markets,
});

const actions = { setMarkets, showLoader, hideLoader };

export const RawComponent = SelectMarkets;

export default connect(mapStateToProps, actions)(withRouter(SelectMarkets));
