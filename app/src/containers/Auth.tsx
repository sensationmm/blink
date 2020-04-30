import React, { useState } from "react";
import { withRouter } from 'react-router-dom';
import styled from "styled-components";
import {
    requestUserSignIn,
    requestUserSignInWithToken,
    requestUserSignUp,
    requestUserSignInFromInvite
} from '../redux/actions/auth';
import { connect } from 'react-redux';
import * as MainStyled from "../components/styles";
import Button from '../components/button';
import Actions from '../layout/actions';
import BlinkLogo from '../svg/blink-logo.svg';
import hidePasswordImg from '../svg/hidePassword.svg';
import showPasswordImg from '../svg/showPassword.svg';
import * as Styled from "./auth-styles";
import TemplateUser from '../templates/user';
import HeaderLock from '../svg/header-lock.svg';
import FormInput from '../components/form-input';
import Blocks from '../layout/blocks';

const ShowPasswordToggle = styled.img`
    position: relative;
    right: 10px;
    top: -20px; 
    transform: translateY(-50%);
    height: 20px;
    width: 20px;
    float: right;
    z-index: 1;
    cursor: pointer;
`

const Auth = (props: any) => {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [personDocId, setPersonDocId] = useState("");
    const [companyDocId, setCompanyDocId] = useState("");
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [hasRequestedSignInWithToken, setHasRequestedSignInWithToken] = useState(false);
    const [hasRequestedSignInFromInvite, setHasRequestedSignInFromInvite] = useState(false);
    const [showSignUp, setshowSignUp] = useState(false);

    const validCredentials = () => username === "" || password === "";

    const toggleShowPassword = () => setPasswordVisible(!passwordVisible)

    const userSignIn = () => {
        props.requestUserSignIn(username, password);
    }

    const userSignUp = () => {
        props.requestUserSignUp([{ email, personDocId, companyDocId }]);
    }

    const validateEmail = () => {
        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        const isValid = re.test(email);
        return isValid;
    }

    const validateNewUser = () => {
        return !(personDocId !== "" && companyDocId !== "" && validateEmail())
    }

    const useTokens = async () => {
        if (!hasRequestedSignInFromInvite && !hasRequestedSignInWithToken) {
            const loginToken = window.location.search;
            if (!hasRequestedSignInFromInvite && loginToken.startsWith("?login=")) {
                setHasRequestedSignInFromInvite(true);
                const response = await props.requestUserSignInFromInvite(loginToken.replace("?login=", ""));
                if (response.localId) {
                    props.history.push({
                        pathname: props.location.pathname,
                        search: ''
                    })
                }
            } else {
                const token = window.localStorage.getItem("firebase-token");
                if (token && token !== "undefined" && !hasRequestedSignInWithToken) {
                    setHasRequestedSignInWithToken(true);
                    props.requestUserSignInWithToken(token);
                }
            }
        }
    }

    useTokens();

    return <TemplateUser headerIcon={HeaderLock}>
        <MainStyled.ContentMini>
            <>
                {
                    showSignUp ?
                        <>
                            <div>
                                <MainStyled.InputSt autoComplete="off" type="text" value={email} placeholder="Email" onChange={(e: any) => setEmail(e.target.value)} />
                                <MainStyled.InputSt autoComplete="off" type="text" value={personDocId} placeholder="Person Doc Id" onChange={(e: any) => setPersonDocId(e.target.value)} />
                                <MainStyled.InputSt autoComplete="off" type="text" value={companyDocId} placeholder="Company Doc Id" onChange={(e: any) => setCompanyDocId(e.target.value)} />

                            </div>
                        </> :
                        <Blocks>
                            <h1 className={'center'}>Please enter your username and password</h1>

                            <FormInput
                                stateKey={'username'}
                                label={'Username'}
                                testId="auth-input-username"
                                onChange={(field: any, value: any) => setUsername(value)}
                                value={username}
                                isEdit
                            />

                            <div>
                                <FormInput
                                    type={passwordVisible ? "text" : "password"}
                                    stateKey={'password'}
                                    label={'Password'}
                                    testId='auth-input-password'
                                    onChange={(field: any, value: any) => setPassword(value)}
                                    value={password}
                                    isEdit
                                />
                                <ShowPasswordToggle src={passwordVisible ? hidePasswordImg : showPasswordImg} onClick={toggleShowPassword} />
                            </div>
                            {/* <div>
                                    <MainStyled.InputSt autoComplete="off" type="text" value={username} placeholder="Username" onChange={(e: any) => setUsername(e.target.value)} />
                                </div>
                                <div>
                                    <MainStyled.InputWrapper>
                                        <MainStyled.InputSt type={passwordVisible ? "text" : "password"} value={password} placeholder="Password" onChange={(e: any) => setPassword(e.target.value)} />
                                        <ShowPasswordToggle src={passwordVisible ? hidePasswordImg : showPasswordImg} onClick={toggleShowPassword} />
                                    </MainStyled.InputWrapper>
                                </div> */}
                        </Blocks>
                }
            </>
            <Actions centered>
                {
                    showSignUp ? <Button onClick={userSignUp} disabled={validateNewUser()} /> :
                        <Button onClick={userSignIn} disabled={validCredentials()} />
                }
            </Actions>

            {/* {!showSignUp && (window.location.href.startsWith("http://localhost:3000") || window.location.href.startsWith("https://blink-staging-20006.firebaseapp.com/")) && <button onClick={() => setshowSignUp(true)}>Show sign up</button>} */}
        </MainStyled.ContentMini>
    </TemplateUser>
}

const mapStateToProps = () => ({});

const actions = {
    requestUserSignIn,
    requestUserSignInWithToken,
    requestUserSignInFromInvite,
    requestUserSignUp
};

export const RawComponent = Auth;

export default connect(mapStateToProps, actions)(withRouter(Auth));