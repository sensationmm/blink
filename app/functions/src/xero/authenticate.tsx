
// code=
// 4032d979cefd915071c48e3c541428a11db24ab06bae5de6eb90fb608c13ec1d

// 55cf9b05a3392b25c27dc6efdfb0436324d9aa26afc37d61dfa9e3901f05df2c
// scope=openid%20profile%20email%20accounting.transactions%20accounting.settingssession_state=-2SShRdV_JmHWN5f_AsDMJSUDVp8o1BzW0MwiZh1Dqg.85c43b3d19466f2f809597484573be93


// app.get('/', function(req, res) {
//   res.send('<a href="/connect">Connect to Xero</a>');
// })

// server.get('/connect', async function(req: any, res: any) {
//   try {
//     let consentUrl = await xero.buildConsentUrl();	  
//     res.redirect(consentUrl);
//   } catch (err) {
//     res.send("Sorry, something went wrong");
//   }
// })

// app.get('/callback', async function(req: any, res: any) {
//     const url = "http://localhost:5000/" + req.originalUrl;
//     await xero.setAccessTokenFromRedirectUri(url);

//     // Optional: read user info from the id token
//     let tokenClaims = await xero.readIdTokenClaims();
//     const accessToken = await xero.readTokenSet();

//     req.session.tokenClaims = tokenClaims;
//     req.session.accessToken = accessToken;
//     req.session.xeroTenantId = xero.tenantIds[0];
//     res.redirect('/organisation');
// })

// app.get('/organisation', async function(req: any, res: any) {  
//   try {
//     const response = await xero.accountingApi.getOrganisations(xero.tenantIds[0])
//     res.send("Hello, " + response.body.organisations[0].name);
//   } catch (err) {
//     res.send("Sorry, something went wrong");
//   }
// })

// const PORT = process.env.PORT || 5000;
// server.listen(PORT, function() {
//   console.log("Your Xero basic public app is running at localhost:" + PORT)
// })

// const session = require('express-session');
// const xero_node = require('xero-node')

// const client_id = process.env.XERO_CLIENT_ID; //'3FBABE06094D4367B18C9F7A44E101C5'
// const client_secret = process.env.XERO_CLIENT_SECRET; // 'g25Axrcfg3B5neAh-7Jnqan2vIzykDWQOpiQDDInSu_noeqp'
// const redirectUri = process.env.XERO_INTEGRATION_CALLBACK_URL; //  'http://localhost:5001/blink-staging-20006/us-central1/xeroAuthenticateCallback'
// const scopes = 'openid profile email accounting.transactions accounting.settings offline_access'

// https://login.xero.com/identity/connect/authorize?response_type=code&client_id=3FBABE06094D4367B18C9F7A44E101C5&redirect_uri=http://localhost:5001/blink-staging-20006/us-central1/xeroAuthenticateCallback&scope=openid%20profile%20email%20accounting.transactions%20accounting.settings%20offline_access&state=123
// https://login.xero.com/identity/connect/authorize?response_type=code&client_id=YOURCLIENTID&redirect_uri=YOURREDIRECTURI&scope=openid profile email accounting.transactions&state=123

// const xero = new xero_node.XeroClient({
//     clientId: client_id,
//     clientSecret: client_secret,
//     redirectUris: [redirectUri],
//     scopes: scopes.split(" ")
// });

// server.set('port', (process.env.PORT || 3001))
// server.use(express.static(__dirname + '/public'))
// server.use(session({
//     secret: 'something crazy',
//     resave: false,
//     saveUninitialized: true, 
//     cookie: { secure: false }
// }));


export { }

const functions = require('firebase-functions');
const cors = require('cors');
const express = require('express');

const server = express();

server.use(cors());

server.get('*/', async function (req: any, res: any) {
    try {
        const uId = req.query.uId;
        const scope = "openid%20profile%20email%20accounting.transactions%20accounting.settings%20offline_access";
        const consentUrl = `https://login.xero.com/identity/connect/authorize?response_type=code&client_id=${process.env.XERO_CLIENT_ID}&redirect_uri=${process.env.XERO_AUTHENTICATE_CALLBACK_URL}&scope=${scope}&state=${uId}`;
        res.send({ url: consentUrl });
    } catch (err) {
        res.send("Sorry, something went wrong");
    }
});

module.exports = functions.https.onRequest(server)