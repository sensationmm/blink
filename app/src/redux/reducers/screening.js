import {
  SET_COUNTRY,
  SET_COMPANY,
  SET_COMPANY_STRUCTURE,
  SET_OWNERSHIP_THRESHOLD,
  SET_COMPLETION,
  SET_ERRORS,
} from '../constants';

export const initialState = {
  company: null,
  companyStructure: null,
  country: { 'value': "GB", 'label': "United Kingdom 🇬🇧" },
  ownershipThreshold: 10,
  validation: null
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

    case SET_COMPLETION:
      return {
        ...state,
        validation: {
          ...state.validation,
          completion: action.completion,
        }
      }

    case SET_ERRORS:
      return {
        ...state,
        validation: {
          ...state.validation,
          errors: action.errors,
        }
      }

    default:
      return state;
  }
};
