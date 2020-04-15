import React, { useState } from "react";
import { withRouter } from 'react-router-dom';
import styled from "styled-components";
import { requestUserSignIn, requestUserSignInWithToken, requestUserSignUp } from '../redux/actions/auth';
import { connect } from 'react-redux';
import * as MainStyled from "../components/styles";
import Button from '../components/button';
import Actions from '../layout/actions';
import BlinkLogo from '../svg/blink-logo.svg';
import hidePasswordImg from '../svg/hidePassword.svg';
import showPasswordImg from '../svg/showPassword.svg';
import * as Styled from "./auth-styles";


const ShowPasswordToggle = styled.img`
    position: absolute;
    right: 10px;
    top: 50%; 
    transform: translateY(-50%);
    height: 20px;
    width: 20px;
    z-index: 1;
`

const Auth = (props: any) => {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [hasRequestedSignInWithToken, setHasRequestedSignInWithToken] = useState(false);
    const [showSignUp, setshowSignUp] = useState(false);


    const token = window.localStorage.getItem("firebase-token");
    if (token && !hasRequestedSignInWithToken) {
        setHasRequestedSignInWithToken(true);
        props.requestUserSignInWithToken(token);
    }

    const validCredentials = () => username === "" || password === "";

    const toggleShowPassword = () => setPasswordVisible(!passwordVisible)

    const userSignIn = () => {
        props.requestUserSignIn(username, password);
    }

    const userSignUp = () => {
        props.requestUserSignUp([email]);
    }

    const validateEmail = () => {
        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        const isValid = re.test(email);
        return !isValid;
    }

    return <><Styled.Header><img alt="blink" src={BlinkLogo} /></Styled.Header>
        <MainStyled.Content>
            <>
                <Styled.AuthWrapper>
                    {
                        showSignUp ?
                            <>   <div><MainStyled.InputSt autoComplete="off" type="text" value={email} placeholder="Email" onChange={(e: any) => setEmail(e.target.value)} /></div>
                            </> :
                            <>
                                <div>
                                    <MainStyled.InputSt autoComplete="off" type="text" value={username} placeholder="Username" onChange={(e: any) => setUsername(e.target.value)} />
                                </div>
                                <div>
                                    <MainStyled.InputWrapper>
                                        <MainStyled.InputSt type={passwordVisible ? "text" : "password"} value={password} placeholder="Password" onChange={(e: any) => setPassword(e.target.value)} />
                                        <ShowPasswordToggle src={passwordVisible ? hidePasswordImg : showPasswordImg} onClick={toggleShowPassword} />
                                    </MainStyled.InputWrapper>
                                </div>
                            </>
                    }

                </Styled.AuthWrapper>
                <button onClick={() => setshowSignUp(true)}>Show sign up</button>
            </>
            <Actions>
                {
                    showSignUp ? <Button onClick={userSignUp} disabled={validateEmail()} /> :
                        <Button onClick={userSignIn} disabled={validCredentials()} />
                }
            </Actions>
        </MainStyled.Content>
    </>
}

const mapStateToProps = () => ({});

const actions = {
    requestUserSignIn,
    requestUserSignInWithToken,
    requestUserSignUp
};

export const RawComponent = Auth;

export default connect(mapStateToProps, actions)(withRouter(Auth));