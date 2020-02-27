import React from "react";
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import * as MainStyled from "../components/styles";
import ScreeningStatus from '../components/screening-status';
import IconEmail from '../svg/icon-email.svg';

import * as Styled from './screening-complete.styles';

const ScreeningComplete = (props: any) => {
    const {
        company,
        companyStructure,
    } = props;

    if (!company || !companyStructure) {
        return <Redirect to="/search" />;
    }

    return (
        <MainStyled.MainSt>
            <ScreeningStatus
                company={companyStructure.name}
                country={companyStructure.incorporationCountry}
            />

            <MainStyled.ContentNarrow>
                <Styled.Main>
                    <Styled.Image />
                    <h1>Email Sent</h1>
                </Styled.Main>
            </MainStyled.ContentNarrow>
        </MainStyled.MainSt>
    )
}

const mapStateToProps = (state: any) => ({
    company: state.screening.company,
    companyStructure: state.screening.companyStructure,
});

export const RawComponent = ScreeningComplete;

export default connect(mapStateToProps)(ScreeningComplete);
