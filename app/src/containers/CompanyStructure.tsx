
import React, { useState } from "react";
import { Redirect, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import SignificantPersons from "../components/generic/persons-with-significant-control";
import { MainSt } from "../components/styles";

import ScreeningStatus from '../components/screening-status';
import { setOwnershipThreshold } from '../redux/actions/screening';

import Box from '../layout/box';
import Button from '../components/button';
import ShareholderList from '../components/shareholder/list';
import Actions from '../layout/actions';
import FlexRow from '../layout/flex-row';

import * as Styled from './company-structure.styles';

const CompanyStructure = (props: any) => {
    const {
        companyStructure,
        ownershipThreshold,
        setOwnershipThreshold
    } = props;

    const [showOnlyOrdinaryShareTypes, toggleShowOnlyOrdinaryShareTypes] = useState(false)

    if (!companyStructure) {
        return <Redirect to="/search" />;
    }

    const ultimateOwners = companyStructure.distinctShareholders.filter((shareholder: any) => shareholder.totalShareholding >= ownershipThreshold);

    return (
        <MainSt>
            <ScreeningStatus
                company={companyStructure.name}
                country={companyStructure.incorporationCountry}
            />

            {companyStructure &&
                <FlexRow layout={[30, 70]}>
                    <Box centered>
                        <Styled.Controls>
                            <Styled.ControlItem><div>{ownershipThreshold} <span>%</span></div> Ownership threshold</Styled.ControlItem>
                            <input
                                type="range"
                                id="shareholderThreshold"
                                value={ownershipThreshold}
                                onChange={e => setOwnershipThreshold(parseInt(e.target.value))}
                                name="shareholderThreshold"
                                min="0"
                                max="100"
                            />
                            <Styled.ControlItem><div>{ultimateOwners.length}</div> Ultimate beneficial owners</Styled.ControlItem>
                        </Styled.Controls>

                        {ultimateOwners.map((owner: any, count: number) => {
                            return (
                                <ShareholderList name={owner.name} type={'P'} shares={owner.totalShareholding} />
                            )
                        })}
                    </Box>

                    <Box padded={false}>
                        <SignificantPersons
                            showOnlyOrdinaryShareTypes={showOnlyOrdinaryShareTypes}
                            shareholderThreshold={ownershipThreshold}
                            companyStructure={companyStructure}
                        />
                    </Box>
                </FlexRow>
            }

            <Actions>
                <Button onClick={() => props.history.push('/company-readiness')} label={'Next'} />
            </Actions>
        </MainSt>
    )
}

const mapStateToProps = (state: any) => ({
    companyStructure: state.screening.companyStructure,
    ownershipThreshold: state.screening.ownershipThreshold,
});

const actions = { setOwnershipThreshold };

export const RawComponent = CompanyStructure;

export default connect(mapStateToProps, actions)(withRouter(CompanyStructure));
