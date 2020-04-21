import React, { useEffect } from "react";
import { withRouter } from 'react-router-dom';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { requestCompanyUBOStructure } from '../utils/generic/request';

import Loader from '../components/loader';
import Blocks from '../layout/blocks';
import { setCompany, setCompanyStructure } from '../redux/actions/screening';

import * as Styled from "../components/styles";

const Header = styled.h1`
    position: relative;
    margin-top: calc(50vh - 150px);
`;

const Onboarding = (props: any) => {

    const {
        setCompany,
        setCompanyStructure,
        currentUser
    } = props;

    useEffect(() => {
        setCompany(currentUser.company);
        startDoinIt();
    }, []);

    const startDoinIt = async (redirect: string = '/onboarding/select-markets') => {
        let UBOStructure = await requestCompanyUBOStructure(currentUser.company.companyId, currentUser.company.countryCode);

        setCompanyStructure(UBOStructure);
        props.history.push(redirect)
    }

    return (
        <Styled.MainSt>
            <Styled.ContentNarrow>
                <Blocks>
                    <Header className={'center'}>Fetching your company</Header>
                    <Loader manual />
                </Blocks>
            </Styled.ContentNarrow>
        </Styled.MainSt>
    )
}

const mapStateToProps = (state: any) => ({
    currentUser: state.auth.user,
    selectedCompany: state.screening.company,
    selectedCountry: state.screening.country,
});

const actions = { setCompany, setCompanyStructure };

export const RawComponent = Onboarding;

export default connect(mapStateToProps, actions)(withRouter(Onboarding));
