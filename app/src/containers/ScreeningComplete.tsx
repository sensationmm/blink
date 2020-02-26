import React from "react";
import { connect } from 'react-redux';

import * as MainStyled from "../components/styles";
import ScreeningStatus from '../components/screening-status';
import IconEmail from '../svg/icon-email.svg';

import * as Styled from './screening-complete.styles';

const ScreeningComplete = (props: any) => {
    const {
        companyStructure,
    } = props;

    return (
        <MainStyled.MainSt>
            <ScreeningStatus
                company={companyStructure.name}
                country={companyStructure.incorporationCountry}
            />

            <MainStyled.ContentNarrow>
                <Styled.Main>
                    <Styled.Image src={IconEmail} />
                    <h1>Email Sent</h1>
                </Styled.Main>
            </MainStyled.ContentNarrow>
        </MainStyled.MainSt>
    )
}

const mapStateToProps = (state: any) => ({
    companyStructure: state.screening.companyStructure,
});

export const RawComponent = ScreeningComplete;

export default connect(mapStateToProps)(ScreeningComplete);
