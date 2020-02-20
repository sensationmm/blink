
import React from "react";
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import { MainSt } from "../components/styles";
import ScreeningStatus from '../components/screening-status';

const MissingData = (props: any) => {
    const {
        companyStructure,
    } = props;

    if (!companyStructure) {
        return <Redirect to="/search" />;
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
    companyStructure: state.screening.companyStructure,
    ownershipThreshold: state.screening.ownershipThreshold,
});

export const RawComponent = MissingData;

export default connect(mapStateToProps)(MissingData);
