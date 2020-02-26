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
        validation,
        ownershipThreshold,
        history
    } = props;

    if (!company || !companyStructure) {
        return <Redirect to="/search" />;
    } else if (!validation) {
        return <Redirect to="/company-structure" />;
    }

    const { completion } = validation;

    const shareholders = companyStructure.distinctShareholders.filter((shareholder: any) => shareholder.totalShareholding > ownershipThreshold);

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
    validation: state.screening.validation,
});

export const RawComponent = ContactClient;

export default connect(mapStateToProps)(withRouter(ContactClient));
