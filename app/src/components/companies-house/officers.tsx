import React, { useState, useEffect } from 'react';
import { requestOfficers } from '../../utils/companies-house/request';
import { MainSt, InputSt, ButtonSt, Company, Errors, Label, Items } from '../styles';
// import CorporateEntityWithSignificantControl from "./corporate-entity-with-significant-control";
import ReactJson from 'react-json-view'

type Props = {
    selectedCompany: any,
    setSelectedOfficer: any
}

export default function Officers({ selectedCompany, setSelectedOfficer }: Props) {

    const [companyId, setcompanyId] = useState("");
    const [officers, setOfficers] = useState();
    const [status, setStatus] = useState();
    const [errors, setErrors] = useState();

    useEffect(
        () => {
            setcompanyId(selectedCompany.company_number)
            setSelectedOfficer();
        }
    );


    const lookupOfficers = async () => {
        setOfficers(null);
        setErrors(null);
        setStatus("searching")
        const res = await requestOfficers(companyId);


        if (res.errors) {
            setStatus(null);
            console.log(res.errors)
            setErrors(res.errors);
        } else {
            setOfficers(res);
        }
    }

    const keyUp = (event: React.KeyboardEvent<HTMLDivElement>): void => {
        if (event.key === 'Enter') {
            event.preventDefault();
            event.stopPropagation();
            lookupOfficers();
        }
    }

    return <MainSt>
        <Label>Officers (List):</Label>
        <InputSt placeholder="Company Id" onKeyUp={keyUp} onChange={(event: any) => setcompanyId(event.target.value)} type="text" value={companyId} />
        <ButtonSt onClick={lookupOfficers} type="button">Go!</ButtonSt>
        {officers && <ReactJson collapsed src={officers} />}
        {officers && <Items>{officers.items
            .filter((item: any) => !item.resigned_on)
            .map((item: any) => <li className={item.officer_role} key={item.name}><span className="title" title={item.officer_role}>{item.name}</span></li>)}</Items>}

        {errors && <Errors>
            {errors.map((error: any) => <li key={error.type}>{error.error}</li>)}
        </Errors>}
    </MainSt>
}