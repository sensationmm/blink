import React from "react";
import { Redirect, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import * as Styled from "../components/styles";
import ScreeningStatus from '../components/screening-status';
import Button from '../components/button';
import Actions from '../layout/actions';
import Readiness from '../components/readiness';
import IconEmail from '../svg/icon-email.svg';

const ContactClient = (props: any) => {
    const {
        company,
        companyStructure,
        validationCompany,
        ownershipThreshold,
        history
    } = props;

    if (!company || !companyStructure) {
        return <Redirect to="/search" />;
    } else if (!validationCompany) {
        return <Redirect to="/company-structure" />;
    }

    const { completion } = validationCompany;

    const shareholders = companyStructure.distinctShareholders.filter((shareholder: any) => shareholder.totalShareholding > ownershipThreshold && shareholder.shareholderType === 'P');

    return (
        <Styled.MainSt>
            <ScreeningStatus
                company={companyStructure.name}
                country={companyStructure.incorporationCountry}
            />

            <Styled.ContentNarrow>
                <Readiness
                    companyStructure={companyStructure}
                    ownershipThreshold={ownershipThreshold}
                    shareholders={shareholders}
                    completion={completion}
                />

                <Actions>
                    <Button onClick={() => history.push('/screening-complete')} label={'Send email to client'} icon={IconEmail} />
                    <Button type={'secondary'} onClick={() => history.push('/missing-data')} label={'Back to edit'} />
                </Actions>
            </Styled.ContentNarrow>
        </Styled.MainSt>
    )
}

const mapStateToProps = (state: any) => ({
    company: state.screening.company,
    companyStructure: state.screening.companyStructure,
    ownershipThreshold: state.screening.ownershipThreshold,
    validationCompany: state.screening.validation.company,
});

export const RawComponent = ContactClient;

export default connect(mapStateToProps)(withRouter(ContactClient));
