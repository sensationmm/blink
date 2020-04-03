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
    dispatch({
        type: HIDE_LOADER,
    });

    return result
};


export const revolutGetBankAccount = (accountId)  => async (dispatch, getState) => {

    dispatch({
        type: SHOW_LOADER,
    });

    const { localId } = getState().auth.user;

    let result = await integrationsUtils.revolutGetBankAccount(localId, accountId);

    dispatch({
        type: HIDE_LOADER,
    });

    return result
};


export const revolutGetBankAccountDetails = (accountId)  => async (dispatch, getState) => {

    dispatch({
        type: SHOW_LOADER,
    });

    const { localId } = getState().auth.user;

    let result = await integrationsUtils.revolutGetBankAccountDetails(localId, accountId);

    dispatch({
        type: HIDE_LOADER,
    });

    return result
};

export const revolutGetBankAccountTransactions = () => async (dispatch, getState) => {

    dispatch({
        type: SHOW_LOADER,
    });

    const { localId } = getState().auth.user;

    let result = await integrationsUtils.revolutGetBankAccountTransactions(localId);

    dispatch({
        type: HIDE_LOADER,
    });

    return result
};


export const revolutGetCounterparties = () => async (dispatch, getState) => {

    dispatch({
        type: SHOW_LOADER,
    });

    const { localId } = getState().auth.user;

    let result = await integrationsUtils.revolutGetCounterparties(localId);
    dispatch({
        type: HIDE_LOADER,
    });

    return result
};

export const revolutPostPayment = (accountId, pendingPaymentAmount, currency, selectedCounterparty, requestId) => async (dispatch, getState) => {
    dispatch({
        type: SHOW_LOADER,
    });

    const { localId } = getState().auth.user;

    let result = await integrationsUtils.revolutPostPayment(localId, accountId, parseFloat(pendingPaymentAmount), currency, selectedCounterparty, requestId);

    if (result.state) {
        dispatch({
            type: SET_MODAL,
            heading: "Message",
            message: "Payment sent"
        });
    }


    else if (result.message) {
        dispatch({
            type: SET_MODAL,
            heading: "Message",
            message: result.message
        });
    }

    dispatch({
        type: HIDE_LOADER,
    });

    return result
};