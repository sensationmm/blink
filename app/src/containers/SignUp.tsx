import React, { useState } from "react";
import { withRouter } from 'react-router-dom';
import styled from "styled-components";
import { requestUserOob, requestUserVerifyOob, requestUserSignInWithToken } from '../redux/actions/auth';
import User from './User';
import { connect } from 'react-redux';
import * as MainStyled from "../components/styles";
import Button from '../components/button';
import Actions from '../layout/actions';
import BlinkLogo from '../svg/blink-logo.svg';
import * as Styled from "./auth-styles";

const SignUp = (props: any) => {

    const [oobCode, setOobCode] = useState("");
    const [hasRequestedOOb, sethasRequestedOOb] = useState(false);

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


    return <><Styled.Header><img alt="blink" src={BlinkLogo} /></Styled.Header>

        <User showDisplayName={false} />
        <MainStyled.Content>

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
        </MainStyled.Content>
    </>
}

const mapStateToProps = () => ({});

const actions = {
    requestUserOob,
    requestUserVerifyOob,
    requestUserSignInWithToken
};

export const RawComponent = SignUp;

export default connect(mapStateToProps, actions)(withRouter(SignUp));