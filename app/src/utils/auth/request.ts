

const domain = window.location.href.indexOf("localhost") > -1 ? "http://localhost:5001/blink-staging-20006/us-central1" : "";

const userSignIn = async (username: string, password: string) => {

    const data = {
        username, 
        password
    }

    const response = await fetch(`${domain}/signIn`, {
        method: 'post',
        body: JSON.stringify(data)
    })

    const body = response.json();

    return body;
};


const userSignInWithToken = async (token: string) => {

    const data = {
        token
    }

    const response = await fetch(`${domain}/signInWithToken`, {
        method: 'post',
        body: JSON.stringify(data)
    })

    const body = response.json();

    return body;
};

export { userSignIn, userSignInWithToken };