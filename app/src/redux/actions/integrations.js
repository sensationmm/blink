import {
    SHOW_LOADER,
    HIDE_LOADER,
    SET_MODAL
} from '../constants';

import * as integrationsUtils from "../../utils/integrations/request";
import { requestUserSignInWithToken } from "../actions/auth";

export const xeroDisconnect = () => async (dispatch, getState) => {

    dispatch({
        type: SHOW_LOADER,
    });

    const { idToken, localId } = getState().auth.user;

    let result = await integrationsUtils.xeroDisconnectIntegration(localId);

    if (result.success) {
        dispatch(requestUserSignInWithToken(idToken));
    }
};

export const xeroGetBankAccounts = () => async (dispatch, getState) => {

    dispatch({
        type: SHOW_LOADER,
    });

    const { localId } = getState().auth.user;

    let result = await integrationsUtils.xeroGetBankAccounts(localId);

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

    let result = await integrationsUtils.xeroDeleteBankAccount(localId, accountId);

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

    let result = await integrationsUtils.xeroToggleAccountStatus(localId, accountId, status);

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


export const revolutGetBankAccounts = () => async (dispatch, getState) => {

    dispatch({
        type: SHOW_LOADER,
    });

    const { localId } = getState().auth.user;

    let result = await integrationsUtils.revolutGetBankAccounts(localId);
    // console.log("result", result)
    dispatch({
        type: HIDE_LOADER,
    });

    return result
};


// 