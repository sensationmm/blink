import React, { useState } from "react";
import { withRouter } from 'react-router-dom';
import styled from "styled-components";
import { requestUserOob, requestUserVerifyOob, requestUserSignInWithToken, requestUserChangePassword } from '../redux/actions/auth';
import User from './User';
import { connect } from 'react-redux';
import * as MainStyled from "../components/styles";
import Button from '../components/button';
import Actions from '../layout/actions';
import BlinkLogo from '../svg/blink-logo.svg';
import * as Styled from "./auth-styles";

const Row = styled.div`
    margin: 50px 0 0 0;
`

const SignUp = (props: any) => {

    // const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [newPasswordRepeat, setNewPasswordRepeat] = useState("");
    const [oobCode, setOobCode] = useState("");
    const [hasRequestedOOb, sethasRequestedOOb] = useState(false);

    const user = props.auth.user;

    const requestOOb = async () => {
        const result = await props.requestUserOob();
        if (!result.error) {
            sethasRequestedOOb(true);
        }
    }

    const verifyOob = async () => {
        const result = await props.requestUserVerifyOob(oobCode);
        if (result.verified) {
            const token = window.localStorage.getItem("firebase-token");
            if (token) {
                props.requestUserSignInWithToken(token);
            }
        }
        if (result.expired) {
            sethasRequestedOOb(false);
        }
    }

    const changePassword = async () => {
        const token = window.localStorage.getItem("firebase-token");
        props.requestUserChangePassword(newPassword, newPasswordRepeat, token)
    }

    const isValidPasswordChange = () => {
        return  newPassword.length > 3 && newPasswordRepeat.length > 3
            // && oldPassword !== "" 
           
    }


    return <><Styled.Header><img alt="blink" src={BlinkLogo} /></Styled.Header>

        <User showDisplayName={false} />
        <MainStyled.ContentNarrow>
            {user.tempPassword ?
                <>
                    {/* <Row>
                        <MainStyled.InputSt autoComplete="off" type="password"
                            value={oldPassword} placeholder="Old Password"
                            onChange={(e: any) => setOldPassword(e.target.value)} />

                    </Row> */}
                    <Row>
                        <MainStyled.InputSt autoComplete="off" type="password"
                            value={newPassword} placeholder="New Password"
                            onChange={(e: any) => setNewPassword(e.target.value)} />
                    </Row>
                    <Row>
                        <MainStyled.InputSt autoComplete="off" type="password"
                            value={newPasswordRepeat} placeholder="Repeat New Password"
                            onChange={(e: any) => setNewPasswordRepeat(e.target.value)} />
                    </Row>
                    <Actions centered>
                        <Button onClick={changePassword} disabled={!isValidPasswordChange()} />
                    </Actions>
                </> :
                <>
                    {hasRequestedOOb && <Styled.AuthWrapper>
                        <div>
                            <MainStyled.InputSt autoComplete="off" type="text" value={oobCode} placeholder="Code" onChange={(e: any) => setOobCode(e.target.value)} />
                        </div>
                    </Styled.AuthWrapper>}
                    <Actions centered>
                        {
                            hasRequestedOOb ? <Button onClick={verifyOob} /> :
                                <Button onClick={requestOOb} label="Request code" />
                        }
                    </Actions>
                </>}
        </MainStyled.ContentNarrow>
    </>
}

const mapStateToProps = (state: any) => ({
    auth: state.auth,
});

const actions = {
    requestUserOob,
    requestUserVerifyOob,
    requestUserSignInWithToken,
    requestUserChangePassword
};

export const RawComponent = SignUp;

export default connect(mapStateToProps, actions)(withRouter(SignUp));