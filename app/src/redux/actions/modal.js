import {
  SET_MODAL,
  CLEAR_MODAL,
} from '../constants';

export const setModal = (heading, message, onClose) => {
  return {
    type: SET_MODAL,
    heading,
    message,
    onClose
  }
}

export const clearModal = () => {
  return {
    type: CLEAR_MODAL,
  }
}
