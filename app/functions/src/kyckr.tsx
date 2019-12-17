const kyckrCors = require('cors');
const kyckrExpress = require('express');
var soap = require('soap');


const kyckrServer = kyckrExpress();

kyckrServer.use(kyckrCors());

kyckrServer.get('/', function (req: any, res: any) {

    const url = 'https://testws.kyckr.eu/gbronboarding.asmx?wsdl';
    var args = { email: 'terry.cordeiro@11fs.com', password: '6c72fde3',  mode: 'cors' };
    
    soap.createClient(url, function(err:any, client:any) {
        console.log("client", client)
        client.CompanySearch(args, function(err:any, result:any) {
            console.log("client", client);
            res.send("here")
        });
    });
})

module.exports = kyckrServer