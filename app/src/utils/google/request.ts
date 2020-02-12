const domain = window.location.href.indexOf("localhost") > -1 ? "http://localhost:5001/blink-3b651/us-central1" : "https://us-central1-blink-3b651.cloudfunctions.net";

const fetchGoogleSheet = async (sheetID: string, tabID: string) => {
    const response = await fetch(`${domain}/googleFetchSheet`, {
        method: "POST",
        mode: "cors",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            sheetID,
            tabID,
        })
    });
    const body = await response.json();
    return body;
}

export { fetchGoogleSheet };
