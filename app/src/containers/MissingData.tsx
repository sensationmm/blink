import React from "react";
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import { MainSt } from "../components/styles";
import ScreeningStatus from '../components/screening-status';

const MissingData = (props: any) => {
    const {
        company,
        companyStructure,
        validation,
    } = props;

    if (!company || !companyStructure) {
        return <Redirect to="/search" />;
    } else if (!validation) {
        return <Redirect to="/company-structure" />;
    }

    return (
        <MainSt>
            <ScreeningStatus
                company={companyStructure.name}
                country={companyStructure.incorporationCountry}
            />
        </MainSt>
    )
}

const mapStateToProps = (state: any) => ({
    company: state.screening.company,
    companyStructure: state.screening.companyStructure,
    ownershipThreshold: state.screening.ownershipThreshold,
    validation: state.screening.validation,
});

export const RawComponent = MissingData;

export default connect(mapStateToProps)(MissingData);
