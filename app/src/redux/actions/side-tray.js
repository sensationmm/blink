import {
    SET_SIDE_TRAY,
    CLEAR_SIDE_TRAY,
} from '../constants';

export const setSideTray = (component, params) => {
    return {
        type: SET_SIDE_TRAY,
        component,
        params,
    }
}

export const clearSideTray = () => {
    return {
        type: CLEAR_SIDE_TRAY,
    }
}
