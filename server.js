const express = require('express');

const port = 3001

const app = express()

require('dotenv').config()

// app.use(require("./app/functions/lib/src/kyckr/searchCompany.js"))

app.use(require("./app/functions/lib/src/kyckr/requestCompanyProfile.js"))

app.listen(port, () => console.log(`Listening on port ${port}!`))