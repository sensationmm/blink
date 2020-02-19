import {
    SET_COMPANY,
    SET_COUNTRY,
    SET_COMPANY_STRUCTURE,
} from '../constants';

export const setCompany = (company) => {
    return {
        type: SET_COMPANY,
        company
    }
}

export const setCountry = (country) => {
    return {
        type: SET_COUNTRY,
        country
    }
}

export const setCompanyStructure = (structure) => {
    return {
        type: SET_COMPANY_STRUCTURE,
        structure
    }
}
