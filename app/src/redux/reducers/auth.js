import {
    USER_SIGNIN_SUCCESS,
    USER_SIGNOUT,
    EDIT_USER
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

        case EDIT_USER:
            const field = action.field.split('.');

            if (field.length > 1) {
                return {
                    ...state,
                    user: {
                        ...state.user,
                        [field[0]]: {
                            ...state.user[field[0]],
                            [field[1]]: action.value
                        }
                    }
                }
            }

            return {
                ...state,
                user: {
                    ...state.user,
                    [action.field]: action.value,
                }
            }

        default:
            return state;
    }
};
