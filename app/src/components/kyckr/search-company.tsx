import React, { useState, useEffect, Dispatch } from 'react';
import styled from "styled-components";
import { searchCompany } from '../../utils/kyckr/request';
import { MainSt, InputSt, ButtonSt, Company, Errors, Label, TypeAhead, InputWrapper, Cancel, CountrySelect } from '../styles';
import CountrySelector from "../countrySelector";
import ReactJson from 'react-json-view'


const delay = 400;

type SearchCompanyProps = {
    setSelectedCompany: Dispatch<any>
}

export default function SearchCompany({ setSelectedCompany }: SearchCompanyProps) {

    const [query, setQuery] = useState("");
    const [companies, setCompanies] = useState();
    const [typeAheadListVisible, showTypeAheadList] = useState(true);
    const [status, setStatus] = useState();
    const [errors, setErrors] = useState();
    const [selectedCountry, setSelectedCountry] = useState({value: "GB", label: "United Kingdom 🇬🇧" });

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
        // Only re-call effect if value changes
        // You could also add the "delay" var to inputs array if you ...
        // ... need to be able to change that dynamically.
        [query, selectedCountry]
    );


    const selectCompany = (company: any) => {
        setCompanies(null)
        setQuery(company.Name)
        setSelectedCompany(company)
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
        const companies = res && res.CompanySearchResult && res.CompanySearchResult.Companies && res.CompanySearchResult.Companies.CompanyDTO


        if (res.errors) {
            setStatus(null);
            console.log(res.errors)
            setErrors(res.errors);
        } else {
            setCompanies(companies || []);
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

    return <>
        {/* <Label>Company Search</Label> */}
        <div style={{ minHeight: 20 }}>
            {companies && <ReactJson collapsed src={companies} />}
        </div>
        {errors && <Errors>
            {errors.map((error: any) => <li key={error.type}>{error.error}</li>)}
        </Errors>}
        <TypeAhead>
            <InputWrapper>
                <InputSt className="with-select" autoFocus onKeyUp={keyUp} placeholder="Company Search" onChange={(event: any) => setQuery(event.target.value)} type="text" value={query} />
                {query && <Cancel className="with-select" onClick={clearCompany}>&times;</Cancel>}
                <CountrySelector isMulti={false} value={selectedCountry} onChange={setSelectedCountry} />
                
            </InputWrapper>
            {companies && typeAheadListVisible && <ul>
                {companies.splice(0, 10).map((company: any) => <li key={company.CompanyID} onClick={() => selectCompany(company)}>{company.Name} <span>({company.CompanyID})</span></li>)}
            </ul>
            }
        </TypeAhead>

    </>
}