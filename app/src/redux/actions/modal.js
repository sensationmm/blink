import {
  SET_MODAL,
  CLEAR_MODAL,
} from '../constants';

export const setModal = (title, message, onClose) => {
  return {
    type: SET_MODAL,
    title,
    message,
    onClose
  }
}

export const clearModal = () => {
  return {
    type: CLEAR_MODAL,
  }
}
