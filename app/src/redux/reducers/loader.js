import {
  SHOW_LOADER,
  HIDE_LOADER,
} from '../constants';

export const initialState = {
  isLoading: false,
  label: null
};

export const loader = (state = initialState, action) => {
  switch (action.type) {
    case SHOW_LOADER:
      return {
        ...initialState,
        isLoading: true,
        label: action.label
      }

    case HIDE_LOADER:
      return {
        ...initialState,
      }

    default:
      return state;
  }
};
