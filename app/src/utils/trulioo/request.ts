

const domain = window.location.href.indexOf("localhost") > -1 ? "http://localhost:5001/blink-staging-20006/us-central1" : "https://us-central1-blink-3b651.cloudfunctions.net";

const verifyDocument = async (documentUrl: string, countryCode: string = "GB") => {

    const response = await fetch(`${domain}/truliooDocumentVerification`, {
        method: "POST",
        mode: "cors",
        headers: {
            'Content-Type': 'application/json'
        },
        body:
            JSON.stringify({
                countryCode,
                documentUrl
            })

    });
    const body = await response.json();
    console.log(body)
    return body;
}
export { verifyDocument }