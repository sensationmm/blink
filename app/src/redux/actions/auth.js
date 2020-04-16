import {
    USER_SIGNIN_SUCCESS, 
    SHOW_LOADER, HIDE_LOADER, USER_SIGNOUT, SET_MODAL
} from '../constants';

import { 
    userSignIn, 
    userSignUp, 
    userSignInWithToken, 
    userRequestOob, 
    userVerifyOob, userRequestSignInFromInvite, userRequestChangePassword } from "../../utils/auth/request"

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

export const requestUserSignUp = emails => async (dispatch) => {

    dispatch({
        type: SHOW_LOADER,
    })

    const result = await userSignUp(emails);

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

    if (!result.verified) {
        dispatch({
            type: SET_MODAL,
            heading: "Invalid code",
            message: "Please try again"
        })
    }

    if (result.expired) {
        dispatch({
            type: SET_MODAL,
            heading: "Code has expired",
            message: "Please request a new code"
        })
    }

    return result;
};


export const requestUserSignInFromInvite = token => async (dispatch) => {

    dispatch({
        type: SHOW_LOADER,
    })

    const result = await userRequestSignInFromInvite(token);

    setTimeout(() => dispatch({
        type: HIDE_LOADER,
    }), 1000);

    if (result.error) {
        return dispatch({
            type: SET_MODAL,
            heading: "Error",
            message: result.error
        });
    }

    dispatch(userSignInSuccess(result))

    return result;
}


export const requestUserChangePassword = (newPassword, repeatNewPassword, idToken) => async (dispatch, getState) => {

    dispatch({
        type: SHOW_LOADER,
    })

    const auth = getState().auth;
    const localId = auth.user.localId

    if (newPassword !== repeatNewPassword) {
        dispatch({
            type: SET_MODAL,
            heading: "Error",
            message: "Passwords don't match"
        });
        setTimeout(() => dispatch({
            type: HIDE_LOADER,
        }), 1000);
    }
    
    const result = await userRequestChangePassword(idToken, localId, newPassword);

    setTimeout(() => dispatch({
        type: HIDE_LOADER,
    }), 1000);

    if (result.error) {
        if (result.error === "CREDENTIAL_TOO_OLD_LOGIN_AGAIN") {
            return dispatch({
                type: SET_MODAL,
                heading: "Please sign in again",
                message: "Your session has expired. You will now be signed out and you'll need to sign in again to perform this operation",
                onClose: () => dispatch(userSignout())
            })
        }
        return dispatch({
            type: SET_MODAL,
            heading: "Error",
            message: result.error
        })
    }

    if (result.success) {
        dispatch({
            type: SET_MODAL,
            heading: "Success",
            message: "Password successfully changed"
        })
        return dispatch(userSignInSuccess(result));
    }

    return result;

};


export const userSignout = () => {
    return {
        type: USER_SIGNOUT
    }
}