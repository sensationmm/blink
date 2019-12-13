import React, { useState } from 'react';
import { searchCompany } from '../../utils/request';
import { MainSt, InputSt, ButtonSt, Company, Errors, Label } from './styles';
import ReactJson from 'react-json-view'

export default function SearchCompany() {

    const [query, setQuery] = useState("");
    const [companies, setCompanies] = useState();
    const [status, setStatus] = useState();
    const [errors, setErrors] = useState();


    const companySearch = async () => {
        console.log("query", query)
        setCompanies(null);
        setErrors(null);
        setStatus("searching")
        const res = await searchCompany(query);

        if (res.errors) {
            setStatus(null);
            console.log(res.errors)
            setErrors(res.errors);
        } else {
            setCompanies(res);
        }
    }

    const keyUp = (event: React.KeyboardEvent<HTMLDivElement>): void => {
        if (event.key === 'Enter') {
            event.preventDefault();
            event.stopPropagation();
            companySearch();
        }
    }

    return <MainSt>
        <Label>Company Search</Label>
        <InputSt onKeyUp={keyUp} placeholder="Company Id" onChange={(event: any) => setQuery(event.target.value)} type="text" value={query} />
        <ButtonSt onClick={companySearch} type="button">Go!</ButtonSt>
        {companies && <Company>
            {companies.length} companies found
        </Company>}

        {companies && <ReactJson src={companies} />}
        {errors && <Errors>
            {errors.map((error: any) => <li key={error.type}>{error.error}</li>)}
        </Errors>}
    </MainSt>
}