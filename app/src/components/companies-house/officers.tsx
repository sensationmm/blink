import React, { useState, useEffect } from 'react';
import { requestOfficers } from '../../utils/request';
import { MainSt, InputSt, ButtonSt, Company, Errors, Label, Items } from './styles';
// import CorporateEntityWithSignificantControl from "./corporate-entity-with-significant-control";
import ReactJson from 'react-json-view'

type Props = {
    selectedCompany: any,
    setSelectedOfficer: any
}

export default function SignificantPersons({ selectedCompany, setSelectedOfficer }: Props) {

    const [companyId, setcompanyId] = useState("");
    const [company, setCompany] = useState();
    const [status, setStatus] = useState();
    const [errors, setErrors] = useState();

    useEffect(
        () => {
            setcompanyId(selectedCompany.company_number)
            setSelectedOfficer();
        }
    );


    const lookupOfficers = async () => {
        setCompany(null);
        setErrors(null);
        setStatus("searching")
        const res = await requestOfficers(companyId);


        if (res.errors) {
            setStatus(null);
            console.log(res.errors)
            setErrors(res.errors);
        } else {
            setCompany(res);
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
        {company && <ReactJson collapsed src={company} />}
        {/* {company && <Items>{company.items
            .filter((item: any) => !item.ceased_on)
            .map((item: any) => <li className={item.kind} key={item.etag}><span className="title">{item.name}</span>
                {item.kind === "corporate-entity-person-with-significant-control" && <CorporateEntityWithSignificantControl companyId={companyId} pscId={item.links.self.split("/").slice(-1)[0] } />}
            </li>)}</Items>} */}

        {errors && <Errors>
            {errors.map((error: any) => <li key={error.type}>{error.error}</li>)}
        </Errors>}
    </MainSt>
}