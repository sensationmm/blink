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

import { validateCompany, CompanyData } from '../utils/validation/request';

import { setOwnershipThreshold, setCompletion, setErrors } from '../redux/actions/screening';
import { showLoader, hideLoader } from '../redux/actions/loader';

import ArrowRight from '../svg/arrow-right.svg';
import * as MainStyled from "../components/styles";
import * as Styled from './company-structure.styles';

type market = 'Core' | 'GB' | 'DE' | 'FR' | 'RO' | 'IT' | 'SE';
type indexedObject = { [key: string]: any };

export const onGetValidation = async (
    showLoader: () => void,
    setErrors: (type: string, src: object) => void,
    companyStructure: CompanyData,
    setCompletion: (type: string, src: object) => void,
    hideLoader: () => void,
    push: (target: string) => void,
    redirect: string
) => {
    showLoader();
    const rules = await validateCompany(companyStructure, 'GB')

    const marketCompletion = {
        Core: {} as indexedObject,
        GB: {} as indexedObject,
        DE: {} as indexedObject,
        FR: {} as indexedObject,
        RO: {} as indexedObject,
        IT: {} as indexedObject,
        SE: {} as indexedObject,
    };

    const marketErrors = {
        Core: {} as indexedObject,
        GB: {} as indexedObject,
        DE: {} as indexedObject,
        FR: {} as indexedObject,
        RO: {} as indexedObject,
        IT: {} as indexedObject,
        SE: {} as indexedObject,
    };

    Object.keys(rules).forEach((rule) => {
        marketCompletion[rule as market] = { passed: rules[rule].passed, total: rules[rule].total };
        marketErrors[rule as market] = rules[rule].errors;
    });
    setCompletion('company', marketCompletion);
    setErrors('company', marketErrors);
    hideLoader();
    push(redirect)
}

const CompanyStructure = (props: any) => {
    const {
        company,
        companyStructure,
        ownershipThreshold,
        setOwnershipThreshold,
        setCompletion,
        setErrors,
        showLoader,
        hideLoader,
    } = props;

    const [showOnlyOrdinaryShareTypes, toggleShowOnlyOrdinaryShareTypes] = useState(false)

    if (!company || !companyStructure) {
        return <Redirect to="/search" />;
    }

    const ultimateOwners = companyStructure.distinctShareholders.filter((shareholder: any) => shareholder.totalShareholding >= ownershipThreshold);

    const getValidation = () => {
        onGetValidation(
            showLoader,
            setErrors,
            companyStructure,
            setCompletion,
            hideLoader,
            props.history.push,
            '/company-readiness'
        );
    };

    return (
        <MainStyled.MainSt>
            <ScreeningStatus
                company={companyStructure.name}
                country={companyStructure.incorporationCountry}
            />

            <MainStyled.Content>
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

                            {ultimateOwners.filter((owner: any) => owner.shareholderType === 'P').map((owner: any, count: number) => {
                                return (
                                    <ShareholderList key={`shareholder-${count}`} name={owner.name} type={owner.shareholderType} shares={owner.totalShareholding} />
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
                    <Button onClick={getValidation} label={'Next'} icon={ArrowRight} />
                </Actions>
            </MainStyled.Content>
        </MainStyled.MainSt>
    )
}

const mapStateToProps = (state: any) => ({
    company: state.screening.company,
    companyStructure: state.screening.companyStructure,
    ownershipThreshold: state.screening.ownershipThreshold,
});

const actions = { setOwnershipThreshold, setCompletion, setErrors, showLoader, hideLoader };

export const RawComponent = CompanyStructure;

export default connect(mapStateToProps, actions)(withRouter(CompanyStructure));
