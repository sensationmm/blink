import React from "react";
import { Redirect, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import Button from '../components/button';
import Actions from '../layout/actions';

import { blinkMarkets } from '../utils/config/blink-markets';
import getByValue from '../utils/functions/getByValue';
import * as MainStyled from "../components/styles";
import * as Styled from './my-accounts.styles';

import OnboardingComplete from '../svg/onboarding-complete.svg';

const MyAccounts = (props: any) => {
    const {
        currentUser,
        company,
        history,
    } = props;

    if (!company) {
        return <Redirect to="/onboarding" />;
    }

    const accounts: Array<any> = [];

    currentUser.markets && currentUser.markets.map((market: any) => {
        const marketName = getByValue(blinkMarkets, 'code', market).name;
        accounts.push(marketName);
    });

    return (
        <MainStyled.MainSt>
            <MainStyled.ContentNarrow>
                <Styled.Completed>
                    <img src={OnboardingComplete} />
                    <h1>
                        <b>Congratulations!</b><br />
                        Felicitari!<br />
                        Herzliche Gl&uuml;ckw&uuml;nschel!
                    </h1>

                    <p>You have opened up your first Blink bank account!<br />Now you can send and receive payments,
                    get connected to local tax experts in {accounts.join(', ')} and more</p>

                    <Actions centered><Button onClick={() => history.push('/my-profile/accounts')} label={"Let's go!"} /></Actions>
                </Styled.Completed>
            </MainStyled.ContentNarrow>
        </MainStyled.MainSt>
    )
}

const mapStateToProps = (state: any) => ({
    currentUser: state.auth.user,
    company: state.screening.company,
});


export const RawComponent = MyAccounts;

export default connect(mapStateToProps)(withRouter(MyAccounts));
