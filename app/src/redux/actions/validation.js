import {
    SET_MODAL,
    SHOW_LOADER,
    HIDE_LOADER
} from '../constants';

import {
    editField,
    addRule
} from "../../utils/validation/request"

export const requestEditMultipleFields = (docId, edits) => async (dispatch,
    getState
) => {

    dispatch({
        type: SHOW_LOADER,
    })

    const auth = getState().auth;

    const keys = Object.keys(edits);

    await Promise.all(keys.map(async (key) => {
        await editField(docId, key, edits[key]?.value, auth.user.localId, edits[key]?.merge);
    }));


    setTimeout(() => {
        dispatch({
            type: SET_MODAL,
            heading: "Success",
            message: "Rules submitted for approval"
        });
        dispatch({
            type: HIDE_LOADER,
        })
    }, 1000);
};

export const requestAddRule = (collection, rule) => async (dispatch,
    getState
) => {

    dispatch({
        type: SHOW_LOADER,
    })

    const auth = getState().auth;

    const result = await addRule(collection, rule, auth.user.localId);

    setTimeout(() => {
        dispatch({
            type: SET_MODAL,
            heading: "Success",
            message: "Rules added for approval"
        });
        dispatch({
            type: HIDE_LOADER,
        })
    }, 1000);

    return result
};