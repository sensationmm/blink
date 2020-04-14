import {
    USER_SIGNIN_SUCCESS, 
    SHOW_LOADER, HIDE_LOADER, USER_SIGNOUT, SET_MODAL
} from '../constants';

import { userSignIn, userSignUp, userSignInWithToken, userRequestOob, userVerifyOob } from "../../utils/auth/request"

export const requestUserSignIn = (user, password) => async (dispatch) => {

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

export const requestUserSignInWithToken = token => async (dispatch) => {

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

    if (result.notFound) {
        return dispatch(userSignout());
    } else {
        return dispatch(userSignInSuccess({ ...result, idToken: token }));
    }
};

export const requestUserSignUp = email => async (dispatch) => {

    dispatch({
        type: SHOW_LOADER,
    })

    const result = await userSignUp(email);

    setTimeout(() => dispatch({
        type: HIDE_LOADER,
    }), 1000);

    if (result.error) {
        return dispatch(userSignupError(result.error.errors));
    }

};

export const userSignInSuccess = user => {

    return {
        type: USER_SIGNIN_SUCCESS,
        user
    }
}

export const userSignInError = errors => async (dispatch) => {

    dispatch({
        type: SET_MODAL,
        heading: "Sign in error",
        message: errors[0].message,
        onClose: () => dispatch(userSignout())
    })
}

export const userSignupError = errors => async (dispatch) => {

    dispatch({
        type: SET_MODAL,
        heading: "Error",
        message: errors[0].message,
        onClose: () => dispatch(userSignout())
    })
}

export const requestUserOob = () => async (dispatch, getState) => {

    dispatch({
        type: SHOW_LOADER,
    })

    const auth = getState().auth;

    const result = await userRequestOob(auth.user.localId);

    setTimeout(() => dispatch({
        type: HIDE_LOADER,
    }), 1000);

    if (result.error) {
        dispatch({
            type: SET_MODAL,
            heading: "Error",
            message: result.error
        })
    }

    return result;

};

export const requestUserVerifyOob = oob => async (dispatch, getState) => {

    dispatch({
        type: SHOW_LOADER,
    })

    const auth = getState().auth;

    const result = await userVerifyOob(auth.user.localId, oob);

    setTimeout(() => dispatch({
        type: HIDE_LOADER,
    }), 1000);

    if (result.error) {
        dispatch({
            type: SET_MODAL,
            heading: "Error",
            message: result.error.errors[0].message
        })
    }

    return result;
};

export const userSignout = () => {
    return {
        type: USER_SIGNOUT
    }
}