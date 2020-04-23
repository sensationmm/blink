import React, { useEffect } from "react";
import { Redirect, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import TemplateUser from '../templates/user';
import Button from '../components/button';
import Actions from '../layout/actions';
import Blocks from '../layout/blocks';
import FormLabel from '../components/form-label';
import FormUploader from '../components/form-uploader';
import { setCompany, setCompanyStructure } from '../redux/actions/screening';
import { editField as apiEditField } from '../utils/validation/request';
import { editUser } from '../redux/actions/auth';
import { showLoader, hideLoader } from '../redux/actions/loader';

import HeaderPassport from '../svg/header-passport.svg';

import * as Styled from "../components/styles";

const Onboarding = (props: any) => {

    const {
        company,
        companyStructure,
        setCompany,
        currentUser,
        history,
        editUser,
        showLoader,
        hideLoader,
        markets
    } = props;

    useEffect(() => {
        setCompany(currentUser.company);
    }, []);

    if (company && companyStructure) {
        return <Redirect to="/onboarding/my-documents" />;
    } else if (markets.length > 0) {
        return <Redirect to="/onboarding/my-company" />;
    } else if (currentUser.screened) {
        return <Redirect to="/onboarding/select-markets" />;
    }

    const loadCompany = async () => {
        showLoader();

        const passport = currentUser.verification?.passport;
        const boardMandate = currentUser.verification?.boardMandate;

        passport && await apiEditField(currentUser.personDocId, 'verification', { passport });
        boardMandate && await apiEditField(currentUser.personDocId, 'verification', { boardMandate });

        editUser('screened', true)
        await apiEditField(`users/${currentUser.localId}`, 'screened', true);

        hideLoader();
        history.push('/onboarding/select-markets');
    }

    const allowProgress = currentUser.verification?.passport && (currentUser.type === 'officer' || currentUser.verification?.boardMandate);

    return (
        <TemplateUser headerIcon={HeaderPassport}>
            <Styled.ContentNarrow>
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
                        <Button label="Select Markets" onClick={loadCompany} disabled={!allowProgress} />
                    </Actions>
                </Blocks>
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
    markets: state.screening.markets,
});

const actions = { showLoader, hideLoader, setCompany, setCompanyStructure, editUser };

export const RawComponent = Onboarding;

export default connect(mapStateToProps, actions)(withRouter(Onboarding));
