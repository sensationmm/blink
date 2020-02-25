import {
    SET_COMPANY,
    SET_COUNTRY,
    SET_COMPANY_STRUCTURE,
    SET_OWNERSHIP_THRESHOLD,
    SET_COMPLETION,
    SET_ERRORS,
    EDIT_FIELD,
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

export const setOwnershipThreshold = (threshold) => {
    return {
        type: SET_OWNERSHIP_THRESHOLD,
        threshold
    }
}

export const setCompletion = (completion) => {
    return {
        type: SET_COMPLETION,
        completion
    }
}

export const setErrors = (errors) => {
    return {
        type: SET_ERRORS,
        errors
    }
}

export const editField = (field, value) => {
    return {
        type: EDIT_FIELD,
        field,
        value
    }
}
