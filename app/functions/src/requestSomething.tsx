const cors = require('cors');
const express = require('express');

const somethingServer = express();

somethingServer.use(cors());

somethingServer.get('/something', function (req, res) {
    res.send("something!")
})

module.exports = somethingServer