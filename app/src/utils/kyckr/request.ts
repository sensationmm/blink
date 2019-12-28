

const domain = window.location.href.indexOf("localhost") > -1 ? "http://localhost:3001" : "https://us-central1-blink-3b651.cloudfunctions.net";

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
    catch(e) {
        return null
    }
}

const getCompanyIdFromSearch = async (query: string, countryISOCode: string = "GB") => {
    const response = await searchCompany(query, countryISOCode);
    const body = await response;
    console.log(query)
    let company;
    if (response && response.CompanySearchResult && 
        response.CompanySearchResult.Companies && 
        response.CompanySearchResult.Companies.CompanyDTO) {
        company = response.CompanySearchResult.Companies.CompanyDTO.find((c: any) => c.Name.toLowerCase() === query.toLowerCase())
        // console.log("getCompanyIdFromSearch", company.CompanyID);
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