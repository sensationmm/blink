export {} 
const functions = require('firebase-functions');
const cors = require('cors');
const express = require('express');
const ipRequest = require('request');

const server = express();


server.use(cors());

server.get('*/', function (req: any, res: any) {

    ipRequest({url: "http://httpbin.org/ip"}, function (error: any, response: any, body: any) {
        console.log(body);
        // console.log("Response", response)
        
        res.send(body)
    });
})


module.exports = functions.https.onRequest(server)