import React, { useState, useEffect, Dispatch } from 'react';
// import { searchCompany } from '../../utils/kyckr/request';
import { searchCompany as dueDilSearchCompany } from '../../utils/duedill/request';
import { searchCompany as kyckrSearchCompany } from '../../utils/kyckr/request';
import { toCamel, normalisePropertyNames } from '../../utils/generic/request';
// import { searchCompany } from '../../utils/opencorporates/request';
import { Errors, InputSt, TypeAhead, InputWrapper, Cancel, FilterLabel } from '../styles';
import CountrySelector, { countries } from "../countrySelector";
// import ReactJson from 'react-json-view'


const delay = 400;

type SearchCompanyProps = {
    setSelectedCompany: Dispatch<any>,
    selectedCountry: any,
    setSelectedCountry: any,
    setIgnoreDB: Function,
    ignoreDB: boolean,
    toggleShowDirectors: Function,
    changeShareholderThreshold: Function,
    shareholderThreshold: number,
    showDirectors: boolean,
    toggleShowOnlyOrdinaryShareTypes: Function,
    showOnlyOrdinaryShareTypes: boolean,
    showControls?: boolean
}

export default function SearchCompany(props: SearchCompanyProps) {

    const [query, setQuery] = useState("");
    const [companies, setCompanies] = useState();
    const [typeAheadListVisible, showTypeAheadList] = useState(true);
    const [status, setStatus] = useState();
    const [errors, setErrors] = useState();
    const [selectedCountry, setSelectedCountry] = useState(props.selectedCountry);

    let handler: any;

    useEffect(
        () => {
            // Set debouncedValue to value (passed in) after the specified delay
            handler = setTimeout(() => {
                if (typeAheadListVisible) {
                    companySearch();
                }
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
        setQuery(company.name)
        clearTimeout(handler)
        props.setSelectedCompany(company)
        showTypeAheadList(false);
    }

    const clearCompany = () => {
        setQuery("");
        props.setSelectedCompany("");
    }

    const companySearch = async () => {
        // console.log("query", query)
        // setCompanies(null);
        setErrors(null);
        setStatus("searching")
        if (query === "") {
            return;
        }

        // console.log(selectedCountry)

        let res;
        if (selectedCountry.value === "IT" || selectedCountry.value === "DE" || selectedCountry.value === "ES" || selectedCountry.value === "RO" ) {
            // duedil don't do IT
            res = await kyckrSearchCompany(query, selectedCountry.value, "11fs-company-search");

        } else {
            res = await dueDilSearchCompany(query, selectedCountry.value);
        }

        if (res.errors) {
            setStatus(null);
            console.log(res.errors)
            setErrors(res.errors);
        } else {
            let companies;

            if (selectedCountry.value === "IT" || selectedCountry.value === "DE" || selectedCountry.value === "ES" || selectedCountry.value === "RO" ) {
                companies = res?.CompanySearchResult?.Companies?.CompanyDTO
            } else {
                companies = res.companies
            }
            // console.log(normalisePropertyNames(toCamel(companies)))
            companies = companies || []
            companies = toCamel(companies);
            companies = normalisePropertyNames(companies);
            setCompanies(companies);
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
    // console.log(companies)
    return <>
        {/* <Label>Company Search</Label> */}
        {/* <div style={{ minHeight: 20 }}>
            {companies && <ReactJson collapsed src={companies} />}
        </div> */}
        {errors && <Errors>
            {errors.map((error: any) => <li key={error.type}>{error.error}</li>)}
        </Errors>}
        <TypeAhead>
            {props.showControls && <>
                <FilterLabel htmlFor="ignoreDB"><span>Ignore DB?</span> <input id="ignoreDB" type="checkbox" checked={props.ignoreDB} onChange={(e: any) => props.setIgnoreDB(e.target.checked)} /> </FilterLabel>
                <FilterLabel htmlFor="showDirectors"><span>Show Directors?</span> <input id="showDirectors" type="checkbox" checked={props.showDirectors} onChange={(e: any) => props.toggleShowDirectors(e.target.checked)} /> </FilterLabel>
                <FilterLabel htmlFor="showOnlyOrdinaryShareTypes"><span>Show only ordinary share types?</span> <input id="showOnlyOrdinaryShareTypes" type="checkbox" checked={props.showOnlyOrdinaryShareTypes} onChange={(e: any) => props.toggleShowOnlyOrdinaryShareTypes(e.target.checked)} /> </FilterLabel>

                <label htmlFor="shareholderRange">Shareholder percentage</label>
                <input style={{ width: 100, padding: 0, margin: "0px 20px 30px" }} type="range" id="shareholderRange" value={props.shareholderRange} onChange={e => props.changeShareholderRange(parseInt(e.target.value))} name="shareholderRange" min="0" max="100" /><span>greater than: {props.shareholderRange} %</span>
            </>
            }
            <InputWrapper>
                <InputSt className="with-select" autoFocus onKeyUp={keyUp} placeholder="Company Search" onChange={(event: any) => setQuery(event.target.value)} type="text" value={query} />
                {query && <Cancel className="with-select" onClick={clearCompany}>&times;</Cancel>}
                <CountrySelector isMulti={false} value={selectedCountry} onChange={(country: any) => {
                    setSelectedCountry(country)
                    props.setSelectedCountry(country)
                }}
                />

            </InputWrapper>
            {companies && typeAheadListVisible && <ul>
                {companies.filter((company: any) => company.simplifiedStatus !== "Closed").splice(0, 10).map((company: any) => <li key={company.companyId} onClick={() => selectCompany(company)}>{company.name} {countries[company.countryCode] && countries[company.countryCode].icon} <span>({company.companyId})</span></li>)}
            </ul>
            }
        </TypeAhead>

    </>
}