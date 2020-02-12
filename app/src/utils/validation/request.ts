const domain = window.location.href.indexOf("localhost") > -1 ? "http://localhost:5001/blink-3b651/us-central1" : "https://us-central1-blink-3b651.cloudfunctions.net";

// @TODO: move this somewhere more company-focused
export interface CompanyData {
    name: string;
}

class Rule {
    [key: string]: any;
}

const validateCompany = async (company: CompanyData, countryID: string) => {
    const response = await fetch(`${domain}/validateCompany`, {
        method: "POST",
        mode: "cors",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            company,
            countryID
        })
    });
    const body = await response.json();
    return body;
}

const addRule = async (rule: any) => {
    const response = await fetch(`${domain}/addRule`, {
        method: "POST",
        mode: "cors",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            rule
        })
    });
    const body = await response.json();
    return body;
}

const deleteAllRules = async () => {
    const response = await fetch(`${domain}/deleteAllRules`, {
        method: "POST",
        mode: "cors",
        headers: {
            'Content-Type': 'application/json'
        }
    });
    const body = await response.json();
    return body.msg;
}

export { validateCompany, addRule, deleteAllRules };
