export {} 

const jwt = require('jsonwebtoken');
const functions = require('firebase-functions');

const REVOLUT_PRIVATE_KEY = (`-----BEGIN RSA PRIVATE KEY-----\n${process.env.REVOLUT_PRIVATE_KEY || functions.config().revolut_private_key.key}\n-----END RSA PRIVATE KEY-----\n`).replace(/\\n/g, '\n');
const REVOLUT_CLIENT_ID = (process.env.REVOLUT_CLIENT_ID || functions.config().revolut_client_id.key);
const REVOLUT_ISSUER = (process.env.REVOLUT_ISSUER || functions.config().revolut_issuer.key);

console.log("REVOLUT_PRIVATE_KEY for refresh", REVOLUT_PRIVATE_KEY)


const aud = 'https://revolut.com' // Constant
const payload = {
  "iss": REVOLUT_ISSUER,
  "sub": REVOLUT_CLIENT_ID,
  "aud": aud
}
// console.log(privateKey.toString())

const generateJWT = () => {
  const token = jwt.sign(payload, REVOLUT_PRIVATE_KEY, { algorithm: 'RS256', expiresIn: 60 * 60 });
  // console.log(token)
  return token;
}

module.exports = generateJWT;