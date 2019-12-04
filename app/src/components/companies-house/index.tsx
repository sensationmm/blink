
import React, { useState } from 'react';
import { requestCompany } from '../../utils/request';
import { HeaderSt, MainSt, InputSt, ButtonSt, Company, Errors } from './styles';
import ReactJson from 'react-json-view'


export default function CompaniesHouse() {
    const [companyId, setcompanyId] = useState("");
    const [company, setCompany] = useState();
    const [status, setStatus] = useState();
    const [errors, setErrors] = useState();


    const lookupCompany = async () => {
        console.log("requesting", companyId)
        setCompany(null);
        setErrors(null);
        setStatus("searching")
        const res = await requestCompany(companyId);


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
            lookupCompany();
        }
    }

    return (
        <>
            <HeaderSt>
                Companies house lookup
            </HeaderSt>

            <MainSt>
                <label>Company Id:</label>
                <InputSt onKeyUp={keyUp} onChange={(event: any) => setcompanyId(event.target.value)} type="text" value={companyId} />
                <ButtonSt onClick={lookupCompany} type="button">Go!</ButtonSt>
                {company && <Company>
                    {company.company_name}
                </Company>}

                {company && <ReactJson src={company} />}
                {errors && <Errors>
                    {errors.map((error: any) => <li key={error.type}>{error.error}</li>)}
                </Errors>}
            </MainSt>

        </>
    )
}
