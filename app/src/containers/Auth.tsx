import React, { useState } from "react";
import { withRouter } from 'react-router-dom';
import { requestUserSignIn, requestUserSignInWithToken} from '../redux/actions/auth';
import { connect } from 'react-redux';
import { InputSt } from "../components/styles";
import * as MainStyled from "../components/styles";
import Button from '../components/button';
import Actions from '../layout/actions';
import BlinkLogo from '../svg/blink-logo.svg';

import * as Styled from "./auth-styles";

const Auth = (props: any) => {


    const token = window.localStorage.getItem("firebase-token");
    if (token) {
        props.requestUserSignInWithToken(token);
    }

    const [username, setUsername] = useState("nick.procopiou@11fs.com");
    const [password, setPassword] = useState("Brain999!!!");

    const validCredentials = () => username === "" || password === "";

    const userSignIn = () => {
        props.requestUserSignIn(username, password);
    }

    return <><Styled.Header><img src={BlinkLogo} /></Styled.Header>
        <MainStyled.Content>

            <Styled.AuthWrapper>
                <div>
                    <InputSt autoComplete="off" type="text" value={username} placeholder="Username" onChange={(e: any) => setUsername(e.target.value)} />
                </div>
                <div>
                    <InputSt type="text" value={password} placeholder="Password" onChange={(e: any) => setPassword(e.target.value)} />
                </div>

            </Styled.AuthWrapper>
            <Actions>
                <Button onClick={userSignIn} disabled={validCredentials()} />
            </Actions>
        </MainStyled.Content>
    </>
}

const mapStateToProps = () => ({});

const actions = {
    requestUserSignIn,
    requestUserSignInWithToken
};

export const RawComponent = Auth;

export default connect(mapStateToProps, actions)(withRouter(Auth));