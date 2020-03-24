
export { }

const admin = require("firebase-admin");
const request = require('request');

  const refreshToken = (refresh_Token: string, uId: string) => {
  let auth = new Buffer(`${process.env.XERO_CLIENT_ID}:${process.env.XERO_CLIENT_SECRET}`);
  let base64auth = auth.toString('base64');

  request.post({
    headers: {
      authorization: `Basic ${base64auth}`,
      "Content-Type": "application/x-www-form-urlencoded"
    },
    url: 'https://identity.xero.com/connect/token',
    body: `grant_type=refresh_token&refresh_Token=${refresh_Token}`
  }, async function (error: any, response: any, body: any) {
    // console.log("response", response.toJSON())
    if (error) {
      console.log("error", error);
    }
    const t = new Date();
    
    const { id_token, access_token, expires_in, refresh_token } = JSON.parse(body);

    const xero = {
      id_token,
      access_token,
      expires: t.setSeconds(t.getSeconds() + parseInt(expires_in)),
      refresh_token
    }

    const userCollection = admin.firestore().collection('users');
    const userDoc = await userCollection.doc(uId);

    await userDoc.update({
      xero: xero
    }, {merge: true});

    return refresh_token
  });
}


module.exports = refreshToken