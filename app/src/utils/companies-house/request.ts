
const stringSimilarity = require('string-similarity');

const domain = window.location.href.indexOf("localhost") > -1 ? "http://localhost:5001/blink-3b651/us-central1" : "https://us-central1-blink-3b651.cloudfunctions.net"

const requestCompany = async (companyId: string) => {
    const response = await fetch(`${domain}/companiesHouseCompany/${companyId}`, { mode: 'cors' });
    const body = await response.json();
    return body;
}

const searchCompany = async (query: string) => {
    const response = await fetch(`${domain}/companiesHouseSearchCompany/${query}`, { mode: 'cors' });
    const body = await response.json();
    return body;
}

const requestSignificantPersons = async (companyId: string) => {
    const response = await fetch(`${domain}/companiesHousePersonsWithSignificantControl/${companyId}`, { mode: 'cors' });
    const body = await response.json();
    return body;
}

const requestSignificantCorporateEntity = async (companyId: string, pscId: string) => {
    const response = await fetch(`${domain}/companiesHouseCompaniesWithSignificantControl/${companyId}/${pscId}`, { mode: 'cors' });
    const body = await response.json();
    return body;
}

const requestOfficers = async (companyId: string) => {
    const response = await fetch(`${domain}/companiesHouseOfficers/${companyId}`, { mode: 'cors' });
    const body = await response.json();
    return body;
}

const getCompanyIdFromSearch = async (query: string) => {
    const response = await searchCompany(query);
    const body = await response;
    // console.log(response)
    let company;
    if (response && response.items) {
        const matches = stringSimilarity.findBestMatch(query, response.items.map(((c: any) => c.title.toLowerCase())));
        company = matches && matches.bestMatchIndex && response.items[matches.bestMatchIndex];
        console.log(query, company);
    }
    if (company && company.company_number) {
        return company.company_number;
    } else if (company && company.identification && company.identification.registration_number) {

        // console.log(company.identification.registration_number)
        return company.identification.registration_number;
    } else {
        return "none";
    }
}

export { requestCompany, requestSignificantPersons, searchCompany, requestSignificantCorporateEntity, requestOfficers, getCompanyIdFromSearch }