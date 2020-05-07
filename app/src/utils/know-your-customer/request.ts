

const domain = window.location.href.indexOf("localhost") > -1 ? "http://localhost:5001/blink-staging-20006/us-central1" : "https://us-central1-blink-3b651.cloudfunctions.net"


// curl -X GET --header 'Accept: application/json' --header 'X-AUTH-TOKEN: f9d27a420f893f02e985960d5168f3b3' 'https://duedil.io/v4/company/gb/06999618.json'


const searchCompany = async (query: string, countryCode: string) => {
    const response = await fetch(`${domain}/knowYourCustomerSearchCompany/${query}/${countryCode}`, { mode: 'cors' });
    const body = await response.json();
    return body;
}

export { searchCompany }