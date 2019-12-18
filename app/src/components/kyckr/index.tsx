
import React, { useState } from "react";
import { HeaderSt } from './styles';


export default function Kyckr() {

    // const [selectedCompany, setSelectedCompany] = useState()

    var soap = require('soap');

    let headers = new Headers();

    headers.append('Content-Type', 'application/json');
    headers.append('Accept', 'application/json');
    headers.append('Authorization', 'Basic terry.cordeiro@11fs.com:6c72fde3');
    headers.append('Origin','http://localhost:3000');


    // var url = 'http://gbronboarding.gbrdirect.com/';
    const url = 'https://testws.kyckr.eu/gbronboarding.asmx?wsdl';
    var args = { email: 'terry.cordeiro@11fs.com', password: '6c72fde3',  mode: 'cors' };


    // soap.createClientAsync(url).then((client: any) => {
    //     console.log(client)
    //     return client.CompanySearch(args);
    // }).then((result: any) => {
    //     console.log(result);
    // });

    // const doTheSoapThing = async () => {
    //     console.log("doTheSoapThing")
    //     const client = await soap.createClient(url);
    //     console.log(client);
    // }

    // doTheSoapThing();
    
    soap.createClient(url, function(err:any, client:any) {
        console.log("client", client)
        client.CompanySearch(args, function(err:any, result:any) {
            console.log("client", client);
        });
    });

    return (
        <>
            <HeaderSt>
                Kyckr lookup
            </HeaderSt>

        </>
    )
}
