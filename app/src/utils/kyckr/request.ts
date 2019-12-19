

const domain = window.location.href.indexOf("localhost") > -1 ? "localhost:3000" : "https://us-central1-blink-3b651.cloudfunctions.net"

const searchCompany = async (query: string) => {
    const response = await fetch(`${domain}/searchCompany/${query}`, { mode: 'cors' });
    const body = await response.json();
    return body;
}


export { searchCompany }