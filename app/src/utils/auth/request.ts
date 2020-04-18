

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


const userSignUp = async (users: Array<any>) => {

    const data = {
        users
    }
    const response = await fetch(`${domain}/signUp`, {
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

const userSignInWithInvite = async (uId: string) => {

    const data = {
        uId
    }

    const response = await fetch(`${domain}/userSignInWithInvite`, {
        method: 'post',
        body: JSON.stringify(data)
    })

    const body = response.json();

    return body;
};

const userRequestOob = async (localId: string) => {

    const data = {
        localId
    }

    const response = await fetch(`${domain}/requestOob`, {
        method: 'post',
        body: JSON.stringify(data)
    })

    const body = response.json();

    return body;
};



const userRequestSignInFromInvite = async (hashedToken: string) => {

    const data = {
        hashedToken
    }

    const response = await fetch(`${domain}/signInFromInvite`, {
        method: 'post',
        body: JSON.stringify(data)
    });

    const body = response.json();

    return body;
};

const userRequestChangePassword = async (idToken: string, localId: string, newPassword: string) => {

    const data = {
        idToken,
        localId,
        newPassword
    }

    const response = await fetch(`${domain}/changePassword`, {
        method: 'post',
        body: JSON.stringify(data)
    })

    const body = response.json();

    return body;
};


const userVerifyOob = async (localId: string, oob: string) => {

    const data = {
        oob,
        localId
    }

    const response = await fetch(`${domain}/verifyOob`, {
        method: 'post',
        body: JSON.stringify(data)
    })

    const body = response.json();

    return body;
};


export { userSignIn, userSignInWithToken, userSignUp, userSignInWithInvite, userRequestOob, userVerifyOob, userRequestChangePassword, userRequestSignInFromInvite };