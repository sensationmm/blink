import {
  SHOW_LOADER,
  HIDE_LOADER,
} from '../constants';

export const showLoader = (label = 'Loading') => {
  return {
    type: SHOW_LOADER,
    label
  }
}

export const hideLoader = () => {
  return {
    type: HIDE_LOADER
  }
}
