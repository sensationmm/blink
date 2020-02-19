
import React, { useState } from "react";
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import SignificantPersons from "../components/generic/persons-with-significant-control";
import { MainSt } from "../components/styles";

import ScreeningStatus from '../components/screening-status';

const CompanyStructure = (props: any) => {
    const {
        companyStructure
    } = props;

    const [showDirectors, toggleShowDirectors] = useState(true);
    const [showOnlyOrdinaryShareTypes, toggleShowOnlyOrdinaryShareTypes] = useState(false)
    const [shareholderRange, changeShareholderRange] = useState(10);

    if (!companyStructure) {
        return <Redirect to="/search" />;
    }

    return (
        <MainSt>
            <ScreeningStatus
                activeStep={'/company-structure'}
                company={companyStructure.name}
                country={companyStructure.incorporationCountry}
            />

            {companyStructure &&
                <SignificantPersons
                    showOnlyOrdinaryShareTypes={showOnlyOrdinaryShareTypes}
                    shareholderRange={shareholderRange}
                    companyStructure={companyStructure}
                    showDirectors={showDirectors}
                />
            }
        </MainSt>
    )
}

const mapStateToProps = (state: any) => ({
    companyStructure: state.screening.companyStructure,
});

export const RawComponent = CompanyStructure;

export default connect(mapStateToProps)(CompanyStructure);
