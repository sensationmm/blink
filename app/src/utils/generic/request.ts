


import { searchCompany as dueDillSearchCompany } from "../duedill/request";

const stringSimilarity = require('string-similarity');
const domain = window.location.href.indexOf("localhost") > -1 ? "http://localhost:5001/blink-3b651/us-central1" : "https://us-central1-blink-3b651.cloudfunctions.net";

const requestCompanyUBOStructure = async (source: string, companyNumber: string, countryISOCode: string = "GB") => {
    const response = await fetch(`${domain}/requestCompanyUBOStructure/${source}/${companyNumber}/${countryISOCode}`, { mode: 'cors' });
    if (response.status === 404) {
        console.log("response", response)
        return "not found"
    } else {
        const body = await response.json();
        return body;
    }
}


const getCompanyIdFromSearch = async (query: string, countryISOCode: Array<string> = ["GB"]) => {
    const response = await dueDillSearchCompany(query, countryISOCode);
    let company;

    if (response && response.companies) {

        const companies = response.companies.map(((c: any) => c.name.toLowerCase()));

        const matches = stringSimilarity.findBestMatch(query.toLowerCase(), companies);
        const bestMatchIndex = matches && matches.bestMatchIndex;
        if (matches.bestMatch && matches.bestMatch.rating > 0.8) {
            company = response.companies[matches.bestMatchIndex];
            // console.log(query, matches, company);
        }

    }
    if (company && company.companyId) {
        // console.log("company", company.name, company.companyId)
        return company.companyId;
    } else {
        return "none";
    }
}

export { requestCompanyUBOStructure, getCompanyIdFromSearch}