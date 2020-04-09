import React, { useEffect, useState } from "react";
import { Redirect, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';


import SetupStatus from '../components/setup-status';
import SignificantPersons from "../components/generic/persons-with-significant-control";
import { shareholderAnimLevel, shareholderAnimVariant } from '../components/shareholder';
import ActionBar from '../components/action-bar';
import ProgressBar from '../components/progress-bar';

import { setOwnershipThreshold, setCompletion, setErrors } from '../redux/actions/screening';
import { showLoader, hideLoader } from '../redux/actions/loader';
import { setSideTray } from '../redux/actions/side-tray';

import SideTray from '../components/side-tray';
import ShareholderEdit from '../components/shareholder-edit';
import * as MainStyled from "../components/styles";
import * as Styled from './my-company.styles';

// type market = 'Core' | 'GB' | 'DE' | 'FR' | 'RO' | 'IT' | 'SE';
// type indexedObject = { [key: string]: any };

interface MyCompanyProgressProps {
    duration: number;
}

const MyCompanyProgress: React.FC<MyCompanyProgressProps> = ({ duration }) => {
    useEffect(() => {
        return () => {
            clearInterval(progressTimeout);
        };
    });

    const [progress, setProgress] = useState(0);

    useEffect(() => {
        if (progress >= duration) {
            clearInterval(progressTimeout);
        }
    }, [progress]);

    const progressTimeout = setInterval(() => setProgress(progress + 100), 100);

    return <ProgressBar value={progress} total={duration} controlled />;
}

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
        setSideTray,
        sideTrayOpen,
        history,
        markets
    } = props;

    let buildingTimeout: any;

    useEffect(() => {
        return () => {
            clearTimeout(buildingTimeout);
        };
    });

    const [building, setBuilding] = useState(true);

    if (markets.length === 0) {
        return <Redirect to="/onboarding/select-markets" />;
    } else if (!company || !companyStructure) {
        return <Redirect to="/onboarding" />;
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

    const calculationTime = companyStructure.shareholderDepth * (shareholderAnimLevel + shareholderAnimVariant);

    buildingTimeout = setTimeout(() => setBuilding(false), calculationTime + 2000);

    return (
        <MainStyled.MainSt className="hasActionBar">
            <SetupStatus markets={markets} />

            <MainStyled.Content>
                {building
                    ? <h1 className="center">Identifying {company.name}'s company structure using public registry sources</h1>
                    : <h1 className="center">Please confirm or edit your company structure so we can identify the UBO's and move on to the next step</h1>
                }

                {building &&
                    <Styled.Progress>
                        <MyCompanyProgress
                            duration={calculationTime}
                        />
                    </Styled.Progress>
                }

                <Styled.MyCompanyStructure>
                    {companyStructure &&
                        <SignificantPersons
                            shareholderThreshold={ownershipThreshold}
                            companyStructure={companyStructure}
                            onClick={editUBO}
                            animate={building}
                        />
                    }
                </Styled.MyCompanyStructure>

                {building && <Styled.Mask />}
            </MainStyled.Content>

            <SideTray />

            <ActionBar
                labelPrimary={'Confirm company structure'}
                actionPrimary={() => history.push('/onboarding/my-documents')}
                labelSecondary={'Complete later'}
                actionSecondary={() => { }}
                hidden={building || sideTrayOpen}
            />
        </MainStyled.MainSt>
    )
}

const mapStateToProps = (state: any) => ({
    sideTrayOpen: state.sideTray.open,
    company: state.screening.company,
    companyStructure: state.screening.companyStructure,
    ownershipThreshold: state.screening.ownershipThreshold,
    markets: state.screening.markets
});

const actions = { setOwnershipThreshold, setCompletion, setErrors, showLoader, hideLoader, setSideTray };

export const RawComponent = MyCompany;

export default connect(mapStateToProps, actions)(withRouter(MyCompany));
