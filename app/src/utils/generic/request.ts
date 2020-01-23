

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

export { requestCompanyUBOStructure }