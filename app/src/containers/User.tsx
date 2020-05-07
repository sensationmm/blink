import React from "react";
import { withRouter } from 'react-router-dom';
import { userSignout } from '../redux/actions/auth';
import { resetScreening } from '../redux/actions/screening';
import { connect } from 'react-redux';
import * as Styled from "./user-styles";

const User = (props: any) => {
    if (!props.auth.user) {
        return <div></div>
    }

    const onSignout = () => {
        props.userSignout();
        props.resetScreening();
    }

    return <Styled.User>
        {props.showDisplayName !== false && (props?.auth?.user.name || props?.auth?.user.email)} -
        <Styled.Button onClick={onSignout}>Signout</Styled.Button>
    </Styled.User>

}

const mapStateToProps = (state: any) => ({
    auth: state.auth,
});

const actions = {
    userSignout,
    resetScreening
};

export const RawComponent = User;

export default connect(mapStateToProps, actions)(withRouter(User));