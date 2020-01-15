

const domain = window.location.href.indexOf("localhost") > -1 ? "http://localhost:5001/blink-3b651/us-central1" : "https://us-central1-blink-3b651.cloudfunctions.net"


// curl -X GET --header 'Accept: application/json' --header 'X-AUTH-TOKEN: f9d27a420f893f02e985960d5168f3b3' 'https://duedil.io/v4/company/gb/06999618.json'


const searchCompany = async (query: string, countryCodes: Array<string> = ["GB"]) => {
    const response = await fetch(`${domain}/duedillSearchCompany/${query}/${countryCodes && countryCodes.join(",")}`, { mode: 'cors' });
    const body = await response.json();
    return body;
}

const requestCompanyShareholders = async (companyNumber: string, countryCode: string = "GB", ignoreDB: boolean = false) => {
    const response = await fetch(`${domain}/duedillCompanyShareholders/${countryCode && countryCode.toLowerCase()}/${companyNumber}${ignoreDB ? '?ignoreDB=true': ''}`, { mode: 'cors' });
    const body = await response.json();
    return body;
}

const requestCompanyPersonsOfSignificantControl = async (companyNumber: string, countryCode: string = "GB",  ignoreDB: boolean = false) => {
    const response = await fetch(`${domain}/duedillCompanyPersonsOfSignificantControl/${countryCode && countryCode.toLowerCase()}/${companyNumber}${ignoreDB ? '?ignoreDB=true': ''}`, { mode: 'cors' });
    const body = await response.json();
    return body;
}

export { searchCompany, requestCompanyShareholders, requestCompanyPersonsOfSignificantControl }