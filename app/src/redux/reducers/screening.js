import {
  SET_COUNTRY,
  SET_COMPANY,
  SET_COMPANY_STRUCTURE,
  SET_OWNERSHIP_THRESHOLD
} from '../constants';

export const initialState = {
  company: null,
  companyStructure: null,
  country: { 'value': "GB", 'label': "United Kingdom 🇬🇧" },
  ownershipThreshold: 10,
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

    case SET_OWNERSHIP_THRESHOLD:
      return {
        ...state,
        ownershipThreshold: action.threshold,
      }

    default:
      return state;
  }
};
