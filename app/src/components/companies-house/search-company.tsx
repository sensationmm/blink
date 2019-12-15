import React, { useState, useEffect, Dispatch } from 'react';
import { searchCompany } from '../../utils/request';
import { MainSt, InputSt, ButtonSt, Company, Errors, Label, TypeAhead, InputWrapper, Cancel } from './styles';
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
        [query]
    );


    const selectCompany = (company: any) => {
        setCompanies(null)
        setQuery(company.title)
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
        showTypeAheadList(true);
        if (event.key === 'Enter') {
            event.preventDefault();
            event.stopPropagation();
            companySearch();
        }
    }

    return <MainSt>
        {/* <Label>Company Search</Label> */}
        <div style={{ minHeight: 20 }}>
            {companies && <ReactJson collapsed src={companies} />}
        </div>
        {errors && <Errors>
            {errors.map((error: any) => <li key={error.type}>{error.error}</li>)}
        </Errors>}
        <TypeAhead>
            <InputWrapper>
                <InputSt autoFocus onKeyUp={keyUp} placeholder="Company Search" onChange={(event: any) => setQuery(event.target.value)} type="text" value={query} />
                {query && <Cancel onClick={clearCompany}>&times;</Cancel>}
            </InputWrapper>
            {companies && typeAheadListVisible && <ul>
                {companies.items.splice(0, 10).map((company: any) => <li key={company.company_number} onClick={() => selectCompany(company)}>{company.title} <span>({company.company_number})</span></li>)}
            </ul>
            }
        </TypeAhead>
        {/* <ButtonSt onClick={companySearch} type="button">Go!</ButtonSt> */}
        {/* {companies && <Company>
            {companies.items.length} companies found
        </Company>} */}


    </MainSt>
}