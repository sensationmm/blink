import React, { useState } from "react";
import { withRouter } from 'react-router-dom';
import styled from "styled-components";
import { requestUserOob, requestUserVerifyOob, requestUserSignInWithToken, requestUserChangePassword, userSignout } from '../redux/actions/auth';
import User from './User';
import { connect } from 'react-redux';
import * as MainStyled from "../components/styles";
import Button from '../components/button';
import Actions from '../layout/actions';
import * as Styled from "./auth-styles";
import TemplateUser from '../templates/user';
import Blocks from '../layout/blocks';
import FormInput from '../components/form-input';
import FormLabel from '../components/form-label';
import VerifyCode from '../components/verify-code';

import HeaderSMS from '../svg/header-sms.svg';
import HeaderLock from '../svg/header-lock.svg';
import HeaderProfile from '../svg/header-profile.svg';

const SignUp = (props: any) => {

    // const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [newPasswordRepeat, setNewPasswordRepeat] = useState("");
    // const [hasRequestedOOb, sethasRequestedOOb] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    const user = props.auth.user;

    const requestOOb = async () => {
        const result = await props.requestUserOob();
        // if (!result.error) {
        //     sethasRequestedOOb(true);
        // }
    }

    const verifyOob = async (oobCode: string) => {
        const result = await props.requestUserVerifyOob(oobCode);
        if (result.verified) {
            setShowSuccess(true);
        }
        // if (result.expired) {
        //     sethasRequestedOOb(false);
        // }
    }

    const completeSetup = () => {
        props.userSignout();
        props.history.push('/onboarding');
    }

    const changePassword = async () => {
        const token = window.localStorage.getItem("firebase-token");
        await props.requestUserChangePassword(newPassword, newPasswordRepeat, token);

        requestOOb();
    }

    const isValidPasswordChange = () => {
        return newPassword.length > 3 && newPasswordRepeat.length > 3
        // && oldPassword !== "" 

    }

    let headerIcon;
    if (user.tempPassword) {
        headerIcon = HeaderLock;
    } else if (!showSuccess) {
        headerIcon = HeaderProfile;
    } else {
        headerIcon = HeaderSMS;
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
                    ? <Blocks>
                        <h1 className={'center'}>We've sent a code to your phone</h1>

                        <FormLabel label={'Enter code to continue'} />

                        <VerifyCode onSubmit={verifyOob} />

                        <Actions centered>
                            <Button small type={'secondary'} onClick={requestOOb} label="Request new code" />
                        </Actions>
                    </Blocks>
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