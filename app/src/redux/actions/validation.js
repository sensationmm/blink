import {
    SET_MODAL,
    SHOW_LOADER,
    HIDE_LOADER
} from '../constants';

import {
    editField
} from "../../utils/validation/request"

export const editMultipleFields = (docId, edits) => async (dispatch,
    // getState
) => {

    dispatch({
        type: SHOW_LOADER,
    })

    // const auth = getState().auth;

    const keys = Object.keys(edits);

    await Promise.all(keys.map(async (key) => {
        await editField(docId, key, edits[key]);
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