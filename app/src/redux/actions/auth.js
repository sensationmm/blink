import {
    USER_SIGNIN_SUCCESS, USER_SIGNIN_ERRORS, SHOW_LOADER, HIDE_LOADER, USER_SIGNOUT, SET_MODAL
} from '../constants';

import { userSignIn, userSignInWithToken } from "../../utils/auth/request"

export const requestUserSignIn = (user, password) => async (dispatch, getState) => {

    dispatch({
        type: SHOW_LOADER,
    })

    const result = await userSignIn(user, password);

    setTimeout(() => dispatch({
        type: HIDE_LOADER,
    }), 1000);

    if (result.error) {
        return dispatch(userSignInError(result.error.errors));
    }

    return dispatch(userSignInSuccess(result));

};

export const requestUserSignInWithToken = token => async (dispatch, getState) => {

    dispatch({
        type: SHOW_LOADER,
    })

    const result = await userSignInWithToken(token);

    setTimeout(() => dispatch({
        type: HIDE_LOADER,
    }), 1000);

    if (result.error) {
        return dispatch(userSignInError(result.error.errors));
    }

    return dispatch(userSignInSuccess({ ...result, idToken: token }));

};

export const userSignInSuccess = user => {

    return {
        type: USER_SIGNIN_SUCCESS,
        user
    }
}

export const userSignInError = errors => async (dispatch, getState) => {

    dispatch({
        type: SET_MODAL,
        heading: "Sign in error",
        message: errors[0].message,
        onClose: () => dispatch(userSignout())
    })
}

export const userSignout = () => {
    return {
        type: USER_SIGNOUT
    }
}