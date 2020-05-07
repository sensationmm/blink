import {
    SHOW_LOADER, HIDE_LOADER, 
} from '../constants';

import * as rules from "../../utils/validation/request"

export const requestAllRules = (collection) => async (dispatch) => {

    dispatch({
        type: SHOW_LOADER,
    })

    const result = await rules.requestAllRules(collection);

    setTimeout(() => dispatch({
        type: HIDE_LOADER,
    }), 1000);
    
    return result

};
