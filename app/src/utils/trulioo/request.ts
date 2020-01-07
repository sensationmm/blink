

const domain = window.location.href.indexOf("localhost") > -1 ? "http://localhost:5001/blink-3b651/us-central1" : "https://us-central1-blink-3b651.cloudfunctions.net";

const searchCompany = async (query: string) => {
    const response = await fetch(`${domain}/truliooSearchCompany/${query}}`, { mode: 'cors' });
    const body = await response.json();
    console.log(body)
    return body;
}

export { searchCompany }