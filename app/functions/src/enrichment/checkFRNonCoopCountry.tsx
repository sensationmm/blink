export { };

const functions = require('firebase-functions');

const cors = require('cors');
const express = require('express');

const { fetchGoogleSheetCached } = require("../google/fetchSheet");

const server = express();
server.use(cors());

function checkFranceBlackList(data: any) {

    const franceBlackList = data.FranceBlackList || '';
    const startDate = stringToDate(data.StartDate || '01/01/1900');
    const endDate = stringToDate(data.EndDate || '01/01/2100');
    const today = new Date();

    if(franceBlackList == 'Y' && startDate <= today && endDate >= today) {
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

async function checkFRNonCoopCountry(countryCode: string) {
    const sheet = JSON.parse(await fetchGoogleSheetCached('1ib1YwPVZiWjYN1mx6VuDipD8oSGjkSzij8xXJrP4GLQ',0));
    const frNonCoopCountries = sheet.filter(checkFranceBlackList);
    for (const country of frNonCoopCountries) {
        if (country['Alpha-2 code'] == countryCode) {
            return true;
        }
    }
    return false;
}

server.get('*/:countryCode', async function (req: any, res: any) {
    
    const countryCode = req.params.countryCode || '';
    console.log('Checking FR Non Coop for '+countryCode);
    const frNonCoopCountry = await checkFRNonCoopCountry(countryCode);
    
    
    res.send(countryCode+' FR Non Coop Country: '+frNonCoopCountry);
})

module.exports = functions.https.onRequest(server);
module.exports.checkFRNonCoopCountry = checkFRNonCoopCountry;
