const express = require('express');

const port = 3001

const app = express()

app.use(require("./app/functions/lib/src/requestCompany.js"))

app.listen(port, () => console.log(`Listening on port ${port}!`))