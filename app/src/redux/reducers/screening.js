import {
  SET_COUNTRY,
  SET_COMPANY,
  SET_COMPANY_STRUCTURE,
} from '../constants';

export const initialState = {
  company: null,
  country: { 'value': "GB", 'label': "United Kingdom 🇬🇧" },
};

export const screening = (state = initialState, action) => {
  switch (action.type) {
    case SET_COUNTRY:
      return {
        ...state,
        country: action.country,
      }

    case SET_COMPANY:
      return {
        ...state,
        company: action.company,
      }

    case SET_COMPANY_STRUCTURE:
      return {
        ...state,
        companyStructure: action.structure,
      }

    default:
      return state;
  }
};
