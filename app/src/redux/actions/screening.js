import {
    SET_COMPANY,
    SET_COUNTRY,
    SET_COMPANY_STRUCTURE,
    SET_OWNERSHIP_THRESHOLD,
    SET_MARKETS,
    SET_COMPANY_CONTACT,
    SET_COMPLETION,
    SET_ERRORS,
    EDIT_FIELD,
    RESET_SCREENING
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

export const setMarkets = (markets) => {
    return {
        type: SET_MARKETS,
        markets
    }
}

export const setCompanyContact = (contact) => {
    return {
        type: SET_COMPANY_CONTACT,
        contact
    }
}

export const setCompletion = (target, completion) => {
    return {
        type: SET_COMPLETION,
        completion,
        target
    }
}

export const setErrors = (target, errors) => {
    return {
        type: SET_ERRORS,
        errors,
        target
    }
}

export const editField = (field, value, collection, docId) => {
    return {
        type: EDIT_FIELD,
        field,
        value,
        collection,
        docId
    }
}

export const resetScreening = () => {
    return {
        type: RESET_SCREENING
    }
}
