

const domain = window.location.href.indexOf("localhost") > -1 ? "http://localhost:3001" : "https://us-central1-blink-3b651.cloudfunctions.net";

const searchCompany = async (query: string, countryISOCode: string = "GB") => {
    const response = await fetch(`${domain}/kyckrSearchCompany/${query}/${countryISOCode}`, { mode: 'cors' });
    const body = await response.json();
    return body;
}

const requestCompanyProfile = async (companyNumber: string, countryISOCode: string = "GB") => {
    const response = await fetch(`${domain}/kyckr/CompanyProfile/${companyNumber}/${countryISOCode}`, { mode: 'cors' });
    const body = await response.json();
    return body;
}



export { searchCompany, requestCompanyProfile }