import React, { useState } from "react";
import { withRouter } from 'react-router-dom';
import { userSignout } from '../redux/actions/auth';
import { connect } from 'react-redux';
import * as Styled from "./user-styles";

const User = (props: any) => {
    console.log(props?.auth)
    return <Styled.User>
        {props?.auth?.user.email} - 
        <Styled.Button onClick={props.userSignout}>Signout</Styled.Button>
    </Styled.User>

}

const mapStateToProps = (state: any) => ({
    auth: state.auth,
});

const actions = {
    userSignout
};

export const RawComponent = User;

export default connect(mapStateToProps, actions)(withRouter(User));