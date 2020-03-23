import {
    SET_SIDE_TRAY,
    CLEAR_SIDE_TRAY,
} from '../constants';

export const initialState = {
    open: false,
    component: null,
    params: {}
};

export const sideTray = (state = initialState, action) => {
    switch (action.type) {
        case SET_SIDE_TRAY:
            return {
                open: true,
                component: action.component,
                params: action.params
            }

        case CLEAR_SIDE_TRAY:
            return initialState;

        default:
            return state;
    }
};
