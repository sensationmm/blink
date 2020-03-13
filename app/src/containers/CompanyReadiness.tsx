import React from "react";
import { Redirect, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import * as Styled from "../components/styles";
import ScreeningStatus from '../components/screening-status';
import Button from '../components/button';
import Actions from '../layout/actions';
import Readiness from '../components/readiness';
import ArrowRight from '../svg/arrow-right.svg';
import getValue from '../utils/functions/getValue';

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

    const shareholders = companyStructure.distinctShareholders.filter((shareholder: any) => shareholder.totalShareholding > ownershipThreshold && getValue(shareholder.shareholderType) === 'P');

    return (
        <Styled.MainSt>
            <ScreeningStatus
                company={getValue(companyStructure.name)}
                country={getValue(companyStructure.incorporationCountry)}
            />

            <Styled.ContentNarrow>
                <Readiness
                    companyStructure={companyStructure}
                    ownershipThreshold={ownershipThreshold}
                    shareholders={shareholders}
                    validation={validation}
                />

                <Actions>
                    <Button onClick={() => props.history.push('/missing-data')} label={'Next'} icon={ArrowRight} />
                </Actions>
            </Styled.ContentNarrow>
        </Styled.MainSt>
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
