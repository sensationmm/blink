

const domain = window.location.href.indexOf("localhost") > -1 ? "https://us-central1-blink-3b651.cloudfunctions.net" : "https://us-central1-blink-3b651.cloudfunctions.net"

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

export { requestCompany, requestSignificantPersons, searchCompany, requestSignificantCorporateEntity, requestOfficers }