
import React, { useState } from "react";
import { withRouter } from 'react-router-dom';
import {
    requestUserOob, requestUserVerifyOob,
} from '../redux/actions/auth';
import * as MainStyled from "../components/styles";
import { connect } from 'react-redux';
import Button from '../components/button';
import Actions from '../layout/actions';
import TemplateUser from '../templates/user';
import Blocks from '../layout/blocks';
import FormLabel from '../components/form-label';
import VerifyCode from '../components/verify-code';
import HeaderSMS from '../svg/header-sms.svg';

const TwoFactorAuthentication = (props: any) => {

    const [hasRequestedOob, sethasRequestedOOb] = useState(false);
    const [code, setCode] = useState('');

    const requestOOb = async () => {
        const result = await props.requestUserOob(props.mobile);
    }

    const verifyOob = async (oobCode: string) => {
        const result = await props.requestUserVerifyOob(oobCode);
        if (props.onSuccess && typeof props.onSuccess === "function") {
            if (result.verified) {
                props.onSuccess()
            }
        }
    }

    const renderBody = () => <Blocks>
        <h1 className={'center'}>We've sent a code to your phone</h1>

        <FormLabel label={'Enter code to continue'} />

        <VerifyCode setCode={setCode} code={code} onSubmit={verifyOob} />

        <Actions centered>
            <Button small type={'secondary'} onClick={() => {
                requestOOb();
                setCode('')
            }} label="Request new code" />
        </Actions>
    </Blocks>

    if (!hasRequestedOob) {
        sethasRequestedOOb(true);
        if (!window.location.href.startsWith("http://localhost:")) {
            requestOOb();
        }
    }

    if (!props.showHeader) {
        return renderBody()
    }

    return <TemplateUser headerIcon={HeaderSMS}>

        <MainStyled.ContentMini>
            {renderBody()}
        </MainStyled.ContentMini>
    </TemplateUser>
}

const mapStateToProps = (state: any, ownProps: any) => ({
    onSuccess: ownProps.onSuccess,
    auth: state.auth,
});

const actions = {
    requestUserOob,
    requestUserVerifyOob,
};

export const RawComponent = TwoFactorAuthentication;

export default connect(mapStateToProps, actions)(withRouter(TwoFactorAuthentication));