import React, { useState } from "react";
import { Redirect, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import SignificantPersons from "../components/generic/persons-with-significant-control";
import Button from '../components/button';
import ScreeningStatus from '../components/screening-status';
import ShareholderList from '../components/shareholder/list';
import Actions from '../layout/actions';
import Box from '../layout/box';
import FlexRow from '../layout/flex-row';
import getValue from '../utils/functions/getValue';

import { validateCompany, CompanyData } from '../utils/validation/request';

import { setOwnershipThreshold, setCompletion, setErrors } from '../redux/actions/screening';
import { showLoader, hideLoader } from '../redux/actions/loader';
import { setSideTray } from '../redux/actions/side-tray';

import SideTray from '../components/side-tray';
import ShareholderEdit from '../components/shareholder-edit';
import ArrowRight from '../svg/arrow-right.svg';
import * as MainStyled from "../components/styles";
import * as Styled from './company-structure.styles';

// type market = 'Core' | 'GB' | 'DE' | 'FR' | 'RO' | 'IT' | 'SE';
// type indexedObject = { [key: string]: any };

const MyCompany = (props: any) => {
    const {
        company,
        companyStructure,
        ownershipThreshold,
        // setOwnershipThreshold,
        // setCompletion,
        // setErrors,
        // showLoader,
        // hideLoader,
        setSideTray
    } = props;


    if (!company || !companyStructure) {
        return <Redirect to="/search" />;
    }

    const editUBO = (shareholder: any, shares: any) => {
        setSideTray(ShareholderEdit, { shareholder, shares });
    }

    // const getValidation = () => {
    //     onGetValidation(
    //         showLoader,
    //         setErrors,
    //         companyStructure,
    //         setCompletion,
    //         hideLoader,
    //         props.history.push,
    //         '/company-readiness',
    //         ownershipThreshold
    //     );
    // };

    return (
        <MainStyled.MainSt>
            <MainStyled.Content>
                <br /><br />
                {companyStructure &&
                    <Box>
                        <SignificantPersons
                            showOnlyOrdinaryShareTypes={false}
                            shareholderThreshold={ownershipThreshold}
                            companyStructure={companyStructure}
                            onClick={editUBO}
                        />
                    </Box>
                }
            </MainStyled.Content>

            <SideTray />
        </MainStyled.MainSt>
    )
}

const mapStateToProps = (state: any) => ({
    company: state.screening.company,
    companyStructure: state.screening.companyStructure,
    ownershipThreshold: state.screening.ownershipThreshold,
});

const actions = { setOwnershipThreshold, setCompletion, setErrors, showLoader, hideLoader, setSideTray };

export const RawComponent = MyCompany;

export default connect(mapStateToProps, actions)(withRouter(MyCompany));
