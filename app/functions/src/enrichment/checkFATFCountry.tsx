export { };

const functions = require('firebase-functions');

const cors = require('cors');
const express = require('express');

const { fetchGoogleSheetCached } = require("../google/fetchSheet");

const server = express();
server.use(cors());

function checkFATF(data: any) {
    const FATF = data.FATF || '';
    const startDate = stringToDate(data.StartDate || '01/01/1900');
    const endDate = stringToDate(data.EndDate || '01/01/2100');
    const today = new Date();

    if(FATF == 'Y' && startDate >= today && endDate <= today) {
        return true;
    }
    else return false;
}

function stringToDate(dateString: string) {
    const date = new Date(0);
    const dateStringArray = dateString.split('/');
        
    date.setFullYear(parseInt(dateStringArray[2]));
    date.setMonth(parseInt(dateStringArray[0])-1);
    date.setDate(parseInt(dateStringArray[1]));

    return date;
}

async function checkFATFCountry(countryCode: string) {
    const sheet = JSON.parse(await fetchGoogleSheetCached('1bso5Sc6_kT07kjOZfbqm3ERK_XYqO1FB0VBR2cuVg2A',0));
    const fatfCountries = sheet.filter(checkFATF);
    for (const country of fatfCountries) {
        if (country['Alpha-2 code'] == countryCode) {
            return true;
        }
    }
    return false;
}

server.get('*/:countryCode', async function (req: any, res: any) {
    
    const countryCode = req.params.countryCode || '';
    console.log('Checking FATF for '+countryCode);
    const fatfCountry = await checkFATFCountry(countryCode);
    
    
    res.send(countryCode+' FATF Country: '+fatfCountry);
})

module.exports = functions.https.onRequest(server);
module.exports.checkFATFCountry = checkFATFCountry;
