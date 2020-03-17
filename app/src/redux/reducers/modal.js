import {
  SET_MODAL,
  CLEAR_MODAL,
  USER_SIGNIN_ERRORS
} from '../constants';

export const initialState = null;

export const modal = (state = initialState, action) => {
  switch (action.type) {
    case SET_MODAL:
      return {
        heading: action.heading,
        message: action.message,
        onClose: action.onClose
      }
    case CLEAR_MODAL:
      return null

    default:
      return state;
  }
};
