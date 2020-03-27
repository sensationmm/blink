import {
    SHOW_LOADER,
    HIDE_LOADER,
    SET_MODAL
} from '../constants';

import * as xeroUtils from "../../utils/integrations/request";
import { requestUserSignInWithToken } from "../actions/auth";

export const xeroDisconnect = () => async (dispatch, getState) => {

    dispatch({
        type: SHOW_LOADER,
    });

    const { idToken, localId } = getState().auth.user;

    let result = await xeroUtils.xeroDisconnectIntegration(localId);

    if (result.success) {
        dispatch(requestUserSignInWithToken(idToken));
    }
};

export const xeroGetBankAccounts = () => async (dispatch, getState) => {

    dispatch({
        type: SHOW_LOADER,
    });

    const { localId } = getState().auth.user;

    let result = await xeroUtils.xeroGetBankAccounts(localId);

    dispatch({
        type: HIDE_LOADER,
    });

    return result
};

export const xeroDeleteBankAccount = accountId => async (dispatch, getState) => {

    dispatch({
        type: SHOW_LOADER,
    });

    const { localId } = getState().auth.user;

    let result = await xeroUtils.xeroDeleteBankAccount(localId, accountId);

    dispatch({
        type: SET_MODAL,
        heading: "Message",
        message: result.message
    })

    dispatch({
        type: HIDE_LOADER,
    });


    return result;
};

export const xeroToggleAccountStatus = (accountId, status = "ARCHIVED") => async (dispatch, getState) => {
    
    dispatch({
        type: SHOW_LOADER,
    });

    const { localId } = getState().auth.user;

    let result = await xeroUtils.xeroToggleAccountStatus(localId, accountId, status);

    dispatch({
        type: SET_MODAL,
        heading: "Message",
        message: result.message
    })

    dispatch({
        type: HIDE_LOADER,
    });

    return result;
};



// 