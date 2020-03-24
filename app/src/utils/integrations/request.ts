const domain = window.location.href.indexOf("localhost") > -1 ? "http://localhost:5001/blink-staging-20006/us-central1" : "";

const xeroAuthenticate = async (uId: string) => {
    const response = await fetch(`${domain}/xeroAuthenticate?uId=${uId}`, {
        method: "GET",
        mode: "cors",
        headers: {
            'Content-Type': 'application/json'
        }
    });

    const body = await response.json();
    if (body.url) {
        return window.location.href = body.url;
    }
    return body;
}


const xeroDisconnectIntegration = async (uId: string) => {

    const response = await fetch(`${domain}/xeroDisconnect/${uId}`, {
        method: "GET",
        mode: "cors",
        headers: {
            'Content-Type': 'application/json'
        }
    });

    const body = await response.json();
    return body;
}

export { xeroAuthenticate, xeroDisconnectIntegration };
