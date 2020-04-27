import React, { useEffect, useState } from "react";
import { Redirect, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import TemplateUser from '../templates/user';
import Button from '../components/button';
import Actions from '../layout/actions';
import Blocks from '../layout/blocks';
import FormLabel from '../components/form-label';
import FormUploader from '../components/form-uploader';
import { setCompany, setCompanyStructure } from '../redux/actions/screening';
import { requestCompanyUBOStructure } from '../utils/generic/request';
import { editField as apiEditField } from '../utils/validation/request';
import { editUser } from '../redux/actions/auth';
import { showLoader, hideLoader } from '../redux/actions/loader';
import Loader from '../components/loader';

import HeaderPassport from '../svg/header-passport.svg';

import * as Styled from "../components/styles";

const Onboarding = (props: any) => {

    const {
        company,
        companyStructure,
        setCompanyStructure,
        setCompany,
        currentUser,
        history,
        editUser,
        showLoader,
        hideLoader,
    } = props;

    const [isPaused, setIsPaused] = useState(true);
    const [renderLoader, setRenderLoader] = useState(true);

    useEffect(() => {
        setCompany(currentUser.company);

        if (currentUser.screened) {
            preloadCompany();
        } else {
            setRenderLoader(false);
            setIsPaused(false);
        }
    }, []);

    const preloadCompany = async () => {
        let UBOStructure = await requestCompanyUBOStructure(currentUser.company.companyId, currentUser.company.countryCode);
        setCompanyStructure(UBOStructure);
        setIsPaused(false);
    }

    if (currentUser.admin) {
        return <Redirect to="/" />;
    } else if (currentUser.onboardingCompleted) {
        return <Redirect to="/onboarding/my-accounts" />;
    }

    if (!isPaused) {
        if (currentUser.structureConfirmed) {
            return <Redirect to="/onboarding/my-documents" />;
        } else if (currentUser.markets?.length > 0) {
            return <Redirect to="/onboarding/my-company" />;
        } else if (currentUser.screened) {
            return <Redirect to="/onboarding/select-markets" />;
        }
    }

    const completeVerification = async () => {
        showLoader();

        const passport = currentUser.verification?.passport;
        const boardMandate = currentUser.verification?.boardMandate;

        passport && await apiEditField(currentUser.personDocId, 'verification', { passport });
        boardMandate && await apiEditField(currentUser.personDocId, 'verification', { boardMandate });

        editUser('screened', true)
        await apiEditField(`users/${currentUser.localId}`, 'screened', true);

        hideLoader();
        history.push('/onboarding/id-check-complete');
    }

    const allowProgress = currentUser.verification?.passport && (currentUser.type === 'officer' || currentUser.verification?.boardMandate);

    return (
        <TemplateUser headerIcon={HeaderPassport}>
            <Styled.ContentNarrow>
                {isPaused || renderLoader
                    ? <div><Loader manual /></div>
                    : (
                        <Blocks>
                            <h1 className={'center'}>We just need a copy of your passport to verify your ID and then you are done!</h1>

                            <FormLabel label={'Upload passport'} tooltip={'We need your passport as proof of ID'} />
                            <FormUploader
                                id={'passport'}
                                onUpload={(src: string, base64File: any) => editUser('verification.passport', base64File)}
                                uploaded={currentUser.verification?.passport}
                                onClearUpload={() => editUser('verification.passport', null)}
                            />

                            {currentUser.type !== 'officer' &&
                                <>
                                    <FormLabel label={'Upload board mandate'} tooltip={`We need proof you are empowered to act on behalf of ${company?.name}`} />
                                    <FormUploader
                                        id={'boardMandate'}
                                        onUpload={(src: string, base64File: any) => editUser('verification.boardMandate', base64File)}
                                        uploaded={currentUser.verification?.boardMandate}
                                        onClearUpload={() => editUser('verification.boardMandate', null)}
                                    />
                                </>
                            }

                            <Actions>
                                <Button label={'Confirm'} onClick={completeVerification} disabled={!allowProgress} />
                            </Actions>
                        </Blocks>
                    )
                }
            </Styled.ContentNarrow>
        </TemplateUser>
    )
}

const mapStateToProps = (state: any) => ({
    company: state.screening.company,
    companyStructure: state.screening.companyStructure,
    currentUser: state.auth.user,
    selectedCompany: state.screening.company,
    selectedCountry: state.screening.country,
});

const actions = { showLoader, hideLoader, setCompany, setCompanyStructure, editUser };

export const RawComponent = Onboarding;

export default connect(mapStateToProps, actions)(withRouter(Onboarding));
