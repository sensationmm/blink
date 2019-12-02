

const domain = window.location.href.indexOf("locahost") ? "http://localhost:3001": "https://us-central1-blink-3b651.cloudfunctions.net"


const requestCompany = async (companyId: string) => {
    const response = await fetch(`${domain}/company/${companyId}`, { mode: 'cors' });
    const body = await response.json();
    return body;
}

export { requestCompany }