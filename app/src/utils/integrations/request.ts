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

const xeroGetBankAccounts = async (uId: string) => {

    const response = await fetch(`${domain}/xeroGetBankAccounts/${uId}`, {
        method: "GET",
        mode: "cors",
        headers: {
            'Content-Type': 'application/json'
        }
    });

    const body = await response.json();

    return body;
}

const xeroDeleteBankAccount = async (uId: string, accountId: string) => {

    const response = await fetch(`${domain}/xeroDeleteBankAccount/${uId}/${accountId}`, {
        method: "GET",
        mode: "cors",
        headers: {
            'Content-Type': 'application/json'
        }
    });

    const body = await response.json();

    return body;
}

const xeroToggleAccountStatus = async (uId: string, accountId: string, status: string) => {

    const response = await fetch(`${domain}/xeroToggleAccountStatus/${uId}/${accountId}/${status}`, {
        method: "GET",
        mode: "cors",
        headers: {
            'Content-Type': 'application/json'
        }
    });

    const body = await response.json();

    return body;
}

const xeroGetInvoices = async (uId: string) => {

    const response = await fetch(`${domain}/xeroGetInvoices/${uId}`, {
        method: "GET",
        mode: "cors",
        headers: {
            'Content-Type': 'application/json'
        }
    });

    const body = await response.json();
    return body;
}


const revolutGetBankAccounts = async (uId: string) => {

    const response = await fetch(`${domain}/revolutGetBankAccounts/${uId}`, {
        method: "GET",
        mode: "cors",
        headers: {
            'Content-Type': 'application/json'
        }
    });

    const body = await response.json();
    return body;
}

const revolutGetBankAccountDetails = async (uId: string, accountId: string) => {

    const response = await fetch(`${domain}/revolutGetBankAccountDetails/${uId}/${accountId}`, {
        method: "GET",
        mode: "cors",
        headers: {
            'Content-Type': 'application/json'
        }
    });

    const body = await response.json();
    return body;
}

const revolutGetCounterparties = async (uId: string, accountId: string) => {

    const response = await fetch(`${domain}/revolutGetCounterparties/${uId}`, {
        method: "GET",
        mode: "cors",
        headers: {
            'Content-Type': 'application/json'
        }
    });

    const body = await response.json();
    return body;
}

const revolutPostPayment = async (uId: string, accountId: string, pendingPaymentAmount: number, currency: string, selectedCounterparty: object, requestId: string)=> {

    const data = {
        uId,
        accountId,
        pendingPaymentAmount,
        currency,
        selectedCounterparty,
        requestId
    }
    
    const response = await fetch(`${domain}/revolutPostPayment`, {
        method: 'post',
        mode: "cors",
        body: JSON.stringify(data)
    })

    const body = await response.json();
    return body;
}

export { 
    xeroAuthenticate, 
    xeroDisconnectIntegration, 
    xeroGetBankAccounts, 
    xeroDeleteBankAccount, 
    xeroGetInvoices, 
    xeroToggleAccountStatus,
    revolutGetBankAccounts,
    revolutGetCounterparties,
    revolutGetBankAccountDetails,
    revolutPostPayment
 };
