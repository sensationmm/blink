
const stringSimilarity = require('string-similarity');

const domain = window.location.href.indexOf("localhost") > -1 ? "http://localhost:5001/blink-staging-20006/us-central1" : "https://us-central1-blink-3b651.cloudfunctions.net"

const searchCompany = async (query: string, jurisdictionCode?: any) => {
    const url = `${domain}/opencorporatesSearchCompany/${query}${jurisdictionCode ? '/' + jurisdictionCode: ''}`;
    console.log("url", url);
    const response = await fetch(url, { mode: 'cors' });
    const body = await response.json();
    console.log("body", body);
    return body;
}

const getCompanyIdFromSearch = async (query: string, countryISOCode: Array<string> = ["GB"]) => {
    const response = await searchCompany(query);
    const body = await response;
    // console.log(response)
    let company;
    if (response && response.items) {
        const matches = stringSimilarity.findBestMatch(query, response.items.map(((c: any) => c.title.toLowerCase())));
        company = matches && matches.bestMatchIndex && response.items[matches.bestMatchIndex];
        // console.log(query, company);
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

export { searchCompany, getCompanyIdFromSearch }