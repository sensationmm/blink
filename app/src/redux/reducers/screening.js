import {
  SET_COUNTRY,
  SET_COMPANY,
  SET_COMPANY_STRUCTURE,
  SET_OWNERSHIP_THRESHOLD,
  SET_MARKETS,
  SET_COMPANY_CONTACT,
  SET_COMPLETION,
  SET_ERRORS,
  EDIT_FIELD,
  RESET_SCREENING
} from '../constants';

export const initialState = {
  company: null,
  companyStructure: null,
  country: { 'value': "GB", 'label': "United Kingdom 🇬🇧" },
  ownershipThreshold: 10,
  validation: {
    company: null,
  },
  markets: [],
  contact: null
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

    case SET_MARKETS:
      return {
        ...state,
        markets: action.markets,
      }

    case SET_COMPANY_CONTACT:
      return {
        ...state,
        contact: action.contact
      }

    case SET_COMPLETION:
      return {
        ...state,
        validation: {
          ...state.validation,
          [action.target]: {
            ...state.validation[action.target],
            completion: action.completion,
          }
        }
      }

    case SET_ERRORS:
      return {
        ...state,
        validation: {
          ...state.validation,
          [action.target]: {
            ...state.validation[action.target],
            errors: action.errors,
          }
        }
      }

    case EDIT_FIELD:
      const field = action.field.split('.');

      if (action.collection) {
        return {
          ...state,
          companyStructure: {
            ...state.companyStructure,
            [action.collection]:
              state.companyStructure[action.collection].map(doc => {
                if (doc.docId === action.docId) {
                  doc[field[0]] = {
                    ...doc[field[0]],
                    [field[1]]: action.value,
                    sourceType: 'entry'
                  };
                }
                return doc;
              })
          }
        }
      }


      return {
        ...state,
        companyStructure: {
          ...state.companyStructure,
          [field[0]]: {
            ...state.companyStructure[field[0]],
            [field[1]]: action.value,
            sourceType: 'entry'
          }
        }
      }

    case RESET_SCREENING:
      return initialState;

    default:
      return state;
  }
};
