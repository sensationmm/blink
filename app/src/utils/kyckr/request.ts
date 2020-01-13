
const stringSimilarity = require('string-similarity');

const domain = window.location.href.indexOf("localhost") > -1 ? "http://localhost:5001/blink-3b651/us-central1" : "https://us-central1-blink-3b651.cloudfunctions.net";

const searchCompany = async (query: string, countryISOCode: string = "GB") => {
    const response = await fetch(`${domain}/kyckrSearchCompany/${query}/${countryISOCode}`, { mode: 'cors' });
    const body = await response.json();
    return body;
}

const requestCompanyProfile = async (companyNumber: string, countryISOCode: string = "GB") => {
    const response = await fetch(`${domain}/kyckrCompanyProfile/${companyNumber}/${countryISOCode}`, { mode: 'cors' });
    try {
        const body = await response.json();
        return body;
    }
    catch (e) {
        return null
    }
}

const getCompanyIdFromSearch = async (query: string, countryISOCode: string = "GB") => {
    const response = await searchCompany(query, countryISOCode);
    // console.log(query)
    let company;
    if (response && response.CompanySearchResult &&
        response.CompanySearchResult.Companies &&
        response.CompanySearchResult.Companies.CompanyDTO) {

        const CompanyDTO = response.CompanySearchResult &&
            response.CompanySearchResult.Companies &&
            response.CompanySearchResult.Companies.CompanyDTO;

        const companies = CompanyDTO.map(((c: any) => c.Name.toLowerCase()));

        const matches = stringSimilarity.findBestMatch(query.toLowerCase(), companies);
        const bestMatchIndex = matches && matches.bestMatchIndex;
        if (matches.bestMatch && matches.bestMatch.rating > 0.8) {
            company = CompanyDTO[matches.bestMatchIndex];
            console.log(query, matches, company);
        }

    }
    if (company && company.CompanyID) {
        return company.CompanyID;
    } else {
        return "none";
    }
}

const requestCompanyOfficials = async (companyNumber: string, countryISOCode: string = "GB") => {
    const response = await fetch(`${domain}/kyckrCompanyOfficials/${companyNumber}/${countryISOCode}`, { mode: 'cors' });
    const body = await response.json();
    return body;
}



export { searchCompany, requestCompanyProfile, requestCompanyOfficials, getCompanyIdFromSearch }