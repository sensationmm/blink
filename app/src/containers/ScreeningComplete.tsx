import React from "react";
import { Redirect, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import * as MainStyled from "../components/styles";
import ScreeningStatus from '../components/screening-status';
import getValue from '../utils/functions/getValue';
import capitalize from "../utils/functions/capitalize";
import Actions from '../layout/actions';
import Button from '../components/button';
import { resetScreening } from '../redux/actions/screening';

import * as Styled from './screening-complete.styles';

const ScreeningComplete = (props: any) => {
    const {
        company,
        companyStructure,
        screeningContact,
        history,
        resetScreening
    } = props;

    if (!company || !companyStructure) {
        return <Redirect to="/search" />;
    } else if (!screeningContact) {
        return <Redirect to="/contact-client" />;
    }

    const reset = () => {
        resetScreening();
        history.push('/search')
    }

    return (
        <MainStyled.MainSt>
            <ScreeningStatus
                company={getValue(companyStructure.name)}
                country={getValue(companyStructure.incorporationCountry)}
            />

            <MainStyled.ContentNarrow>
                <Styled.Main>
                    <Styled.Image />

                    <h1>Email sent to {capitalize(screeningContact.name)} at {getValue(companyStructure.name)}</h1>

                    <Actions centered>
                        <Button onClick={reset} label={'Back to search'} />
                    </Actions>
                </Styled.Main>
            </MainStyled.ContentNarrow>
        </MainStyled.MainSt>
    )
}

const mapStateToProps = (state: any) => ({
    screeningContact: state.screening.contact,
    company: state.screening.company,
    companyStructure: state.screening.companyStructure,
});

const actions = { resetScreening };

export const RawComponent = ScreeningComplete;

export default connect(mapStateToProps, actions)(withRouter(ScreeningComplete));
