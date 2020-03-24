import {
    SHOW_LOADER,
    HIDE_LOADER
} from '../constants';

import { xeroDisconnectIntegration } from "../../utils/integrations/request";
import { requestUserSignInWithToken } from "../actions/auth";

export const xeroDisconnect = (uId) => async (dispatch, getState) => {
    
    dispatch({
        type: SHOW_LOADER,
    });

    let result = await xeroDisconnectIntegration(uId);

    const { idToken } = getState().auth.user;

    if (result.success) {
        dispatch(requestUserSignInWithToken(idToken));
    }



   

};