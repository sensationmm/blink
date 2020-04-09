const domain = window.location.href.indexOf("localhost") > -1 ? "http://localhost:5001/blink-staging-20006/us-central1" : "";

// @TODO: move this somewhere more company-focused
export interface CompanyData {
    name: any;
}

// class Rule {
//     [key: string]: any;
// }

const validateCompany = async (company: CompanyData, ownershipThreshold: string) => {
    const response = await fetch(`${domain}/validateCompany`, {
        method: "POST",
        mode: "cors",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            company,
            ownershipThreshold
        })
    });
    const body = await response.json();
    return body;
}

const addRule = async (rule: any, collection: string) => {
    const response = await fetch(`${domain}/addRule`, {
        method: "POST",
        mode: "cors",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            rule,
            collection
        })
    });
    const body = await response.json();
    return body;
}

const deleteAllRules = async (collection: string) => {
    const response = await fetch(`${domain}/deleteAllRules`, {
        method: "POST",
        mode: "cors",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            collection
        })
    });
    const body = await response.json();
    return body.msg;
}

const editField = async (docId: string, field: string, value: any) => {
    const response = await fetch(`${domain}/editField`, {
        method: "POST",
        mode: "cors",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            docId,
            field,
            value,
        })
    });
    const body = await response.json();
    return body.msg;
}

const addUBO = async (parentDocId: string, type: string, percentage: string, name: string, role: string) => {
    const response = await fetch(`${domain}/addUBO`, {
        method: "POST",
        mode: "cors",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            parentDocId, type, percentage, name, role
        })
    });
    const body = await response.json();
    return body.msg;
}

const deleteUBO = async (relationshipDocId: string) => {
    const response = await fetch(`${domain}/deleteUBO`, {
        method: "POST",
        mode: "cors",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            relationshipDocId
        })
    });
    const body = await response.json();
    return body.msg;
}



export { validateCompany, addRule, deleteAllRules, editField, addUBO, deleteUBO };
