import {
    USER_SIGNIN_SUCCESS,
    USER_SIGNOUT
} from '../constants';

export const initialState = {
    user: null
};

export const auth = (state = initialState, action) => {
    switch (action.type) {
        case USER_SIGNIN_SUCCESS: {

            const t = new Date();

            const expires = t.setSeconds(t.getSeconds() + parseInt(action.user.expiresIn));

            if (window.localStorage) {
                window.localStorage.setItem("firebase-token", action.user.idToken)
            }
            return {
                ...initialState,
                user: { ...action.user, expires }
            }
        }
        case USER_SIGNOUT:

            if (window.localStorage) {
                window.localStorage.removeItem("firebase-token")
            }

            return {
                ...initialState,
                user: null
            }
        default:
            return state;
    }
};
