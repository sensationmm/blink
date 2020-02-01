import React, { useState, useEffect, Dispatch } from 'react';
import { searchCompany } from '../../utils/opencorporates/request';
import { InputSt, Errors, TypeAhead, InputWrapper, Cancel } from '../styles';
import CountrySelector, { countries } from "../countrySelector";
import styled from "styled-components";

const StCancel = styled(Cancel)`
    top: 50%;
`

const delay = 400;

type SearchCompanyProps = {
    setSelectedCompany: Dispatch<any>,
    setIgnoreDB: Function,
    ignoreDB: boolean,
    selectedCountry: any,
    setSelectedCountry: any,
    toggleShowDirectors: Function,
    changeShareholderRange: Function,
    shareholderRange: number,
    showDirectors: boolean,
    toggleShowOnlyOrdinaryShareTypes: Function,
    showOnlyOrdinaryShareTypes: boolean,
}

export default function SearchCompany({ setSelectedCompany, setIgnoreDB, ignoreDB }: SearchCompanyProps) {

    const [query, setQuery] = useState("");
    const [companies, setCompanies] = useState();
    const [typeAheadListVisible, showTypeAheadList] = useState(true);
    const [status, setStatus] = useState();
    const [errors, setErrors] = useState();
    const [selectedCountry, setSelectedCountry] = useState({ value: "any", label: "Any" });

    // console.log("ignoreDB", ignoreDB)

    useEffect(
        () => {
            // Set debouncedValue to value (passed in) after the specified delay
            const handler = setTimeout(() => {
                companySearch();
            }, delay);

            return () => {
                clearTimeout(handler);
            };
        },
        [query, selectedCountry]
    );


    const selectCompany = (company: any) => {
        setCompanies(null)
        setQuery(company.name)
        setSelectedCompany({ ...company, companyId: company.company_number });
        showTypeAheadList(false);
}

const clearCompany = () => {
    setQuery("");
    setSelectedCompany("");
}



const companySearch = async () => {
    // console.log("query", query)
    // setCompanies(null);
    setErrors(null);
    setStatus("searching")
    if (query === "") {
        return;
    }
    const res = await searchCompany(query, selectedCountry.value);

    if (res.errors) {
        setStatus(null);
        console.log(res.errors)
        setErrors(res.errors);
    } else {
        // console.log("companiescompanies", res.companies)
        setCompanies(res?.results?.companies);
    }
}

const keyUp = (event: React.KeyboardEvent<HTMLDivElement>): void => {
    showTypeAheadList(true);
    if (event.key === 'Enter') {
        event.preventDefault();
        event.stopPropagation();
        companySearch();
    }
}
return <div>
    {errors && <Errors>
        {errors.map((error: any) => <li key={error.type}>{error.error}</li>)}
    </Errors>}
    <TypeAhead>
        <label style={{ width: "100%", float: "left", zIndex: 1, position: "relative" }} htmlFor="ignoreDB"><span>Ignore DB?</span> <input style={{ float: "left", width: 20, marginBottom: 20 }} id="ignoreDB" type="checkbox" checked={ignoreDB} onChange={(e: any) => setIgnoreDB(e.target.checked)} /> </label>
        <InputWrapper>
            <CountrySelector isMulti={false} showAny value={selectedCountry} onChange={setSelectedCountry} />
            <InputSt className="with-select" autoFocus onKeyUp={keyUp} placeholder="Company Search" onChange={(event: any) => setQuery(event.target.value)} type="text" value={query} />
            {query && <StCancel className="with-select" onClick={clearCompany}>&times;</StCancel>}
        </InputWrapper>
        {companies && typeAheadListVisible && <ul>
            {companies.splice(0, 15).map((item: any) => <li className={item.company.current_status} key={item.company.company_number} onClick={() => selectCompany(item.company)}>{item.company.name} {countries[item.company?.jurisdiction_code?.toUpperCase()]?.icon} <span>({item.company.company_number})</span></li>)}
        </ul>
        }
    </TypeAhead>

</div>
}