import React from "react";
import { Redirect, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import * as Styled from "../components/styles";
import ScreeningStatus from '../components/screening-status';
import Button from '../components/button';
import Actions from '../layout/actions';
import Readiness from '../components/readiness';
import getValue from '../utils/functions/getValue';

const CompanyCompletion = (props: any) => {
    const {
        company,
        companyStructure,
        validation,
        ownershipThreshold,
        history,
        markets
    } = props;

    if (!company || !companyStructure || markets.length === 0) {
        return <Redirect to="/search" />;
    } else if (!validation) {
        return <Redirect to="/company-structure" />;
    }

    let hasShareholderOver25 = false;

    const shareholders = companyStructure.distinctShareholders
        .filter((shareholder: any) => shareholder.totalShareholding > ownershipThreshold && getValue(shareholder.shareholderType) === 'P')
        .map((shareholder: any) => {
            if (shareholder.totalShareholding > 25) {
                hasShareholderOver25 = true;
            }

            return shareholder;
        });


    let officers = [];
    if (!hasShareholderOver25) {
        officers = companyStructure.officers;
    }

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
                    shareholders={shareholders.concat(officers)}
                    validation={validation}
                    markets={markets}
                />

                <Actions>
                    <Button onClick={() => history.push('/contact-client')} label={'Contact client'} />
                    <Button type={'tertiary'} onClick={() => history.push('/missing-data')} label={'Back to edit'} />
                </Actions>
            </Styled.ContentNarrow>
        </Styled.MainSt>
    )
}

const mapStateToProps = (state: any) => ({
    markets: state.screening.markets,
    company: state.screening.company,
    companyStructure: state.screening.companyStructure,
    ownershipThreshold: state.screening.ownershipThreshold,
    validation: state.screening.validation,
});

export const RawComponent = CompanyCompletion;

export default connect(mapStateToProps)(withRouter(CompanyCompletion));
