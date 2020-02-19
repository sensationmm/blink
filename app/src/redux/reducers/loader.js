import {
  SHOW_LOADER,
  HIDE_LOADER,
} from '../constants';

export const initialState = {
  isLoading: false
};

export const loader = (state = initialState, action) => {
  switch (action.type) {
    case SHOW_LOADER:
      return {
        ...initialState,
        isLoading: true,
      }

    case HIDE_LOADER:
      return {
        ...initialState,
        isLoading: false,
      }

    default:
      return state;
  }
};
