import {
  SET_WIDTH,
} from '../constants';

export const setWidth = (width) => {
  return {
    type: SET_WIDTH,
    payload: width
  }
}
