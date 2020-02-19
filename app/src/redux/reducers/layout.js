import {
  SET_WIDTH
} from '../constants';

export const initialState = {
  isMobile: false,
};

export const layout = (state = initialState, action) => {
  switch (action.type) {
    case SET_WIDTH:
      return {
        ...initialState,
        isMobile: action.payload < 800
      };

    default:
      return state;
  }
};
