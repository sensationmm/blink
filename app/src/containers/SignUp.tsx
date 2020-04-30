import React, { useState } from "react";
import { withRouter } from 'react-router-dom';
import { 
    requestUserOob, requestUserVerifyOob, 
    requestUserSignInWithToken, requestUserChangePassword, userSignout } from '../redux/actions/auth';
import TwoFactorAuthentication from './TwoFactorAuthentication';
import { connect } from 'react-redux';
import * as MainStyled from "../components/styles";
import Button from '../components/button';
import Actions from '../layout/actions';
import TemplateUser from '../templates/user';
import Blocks from '../layout/blocks';
import FormInput from '../components/form-input';

import HeaderSMS from '../svg/header-sms.svg';
import HeaderLock from '../svg/header-lock.svg';
import HeaderProfile from '../svg/header-profile.svg';

import Landing from './Landing';

const SignUp = (props: any) => {
    const user = props.auth.user;
    const [newPassword, setNewPassword] = useState("");
    const [newPasswordRepeat, setNewPasswordRepeat] = useState("");
    const [showSuccess, setShowSuccess] = useState(false);
    const [showLanding, setShowLanding] = useState(!props.auth.user.verified);
    const [mobile, setMobile] = useState('+44 7');
    const [mobileHasError, setMobileHasError] = useState(false);

    const completeSetup = () => {
        props.userSignout();
        props.history.push('/onboarding');
    }

    const changePassword = async () => {
        const token = window.localStorage.getItem("firebase-token");
        await props.requestUserChangePassword(newPassword, newPasswordRepeat, token);
    }

    const isValidPasswordChange = () => {
        return newPassword.length > 3 && newPasswordRepeat.length > 3

    }

    const checkMobile = () => {
        if (mobile !== '' && mobile !== '+44 7') {
            setShowLanding(false)
        } else {
            setMobileHasError(true);
        }
    }

    let headerIcon;
    if (user.tempPassword) {
        headerIcon = HeaderLock;
    } else if (!showSuccess) {
        headerIcon = HeaderProfile;
    } else {
        headerIcon = HeaderSMS;
    }

    if (showLanding) {
        return (
            <Landing
                mobileNo={mobile}
                onClick={checkMobile}
                onType={(field: string, value: any) => setMobile(value)}
                error={mobileHasError}
            />
        )
    }

    return <TemplateUser headerIcon={headerIcon}>

        <MainStyled.ContentMini>
            {user.tempPassword ?
                <Blocks>
                    <h1 className={'center'}>Please create a password</h1>

                    <FormInput
                        stateKey={'username'}
                        label={'Username'}
                        onChange={(field: any, value: any) => setNewPassword(value)}
                        disabled={true}
                        value={user.emailAddress}
                        isEdit
                    />

                    <FormInput
                        type={'password'}
                        stateKey={'password'}
                        label={'New Password'}
                        onChange={(field: any, value: any) => setNewPassword(value)}
                        value={newPassword}
                        isEdit
                    />

                    <FormInput
                        type={'password'}
                        stateKey={'passwordConfirm'}
                        label={'Repeat New Password'}
                        onChange={(field: any, value: any) => setNewPasswordRepeat(value)}
                        value={newPasswordRepeat}
                        isEdit
                    />

                    <Actions centered>
                        <Button onClick={changePassword} disabled={!isValidPasswordChange()} />
                    </Actions>
                </Blocks>
                : (!showSuccess
                    ? <TwoFactorAuthentication onSuccess={() => setShowSuccess(true)} mobile={mobile} />
                    : <Blocks>
                        <h1 className={'center'}>Congratulations you have created your personal profile!</h1>
                        <h2 className={'center'}>We need you to log back in to complete this step</h2>

                        <Actions centered>
                            <Button onClick={completeSetup} label="Log In" />
                        </Actions>
                    </Blocks>
                )

            }
        </MainStyled.ContentMini>
    </TemplateUser >
}

const mapStateToProps = (state: any) => ({
    auth: state.auth,
});

const actions = {
    requestUserOob,
    requestUserVerifyOob,
    requestUserSignInWithToken,
    requestUserChangePassword,
    userSignout
};

export const RawComponent = SignUp;

export default connect(mapStateToProps, actions)(withRouter(SignUp));