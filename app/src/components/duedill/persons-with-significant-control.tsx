import React, { useState, useEffect } from 'react';
import { requestCompanyShareholders } from '../../utils/duedill/request';
import { MainSt, InputSt, ButtonSt, Company, Errors, Label, Items } from '../styles';
import ShareHolder from "./persons-with-significant-control";
// import CorporateEntityWithSignificantControl from "./corporate-entity-with-significant-control";
import ReactJson from 'react-json-view'

type Props = {
    selectedCompany: any,
    setSelectedSignificantPersons: any
}

export default function SignificantPersons({ selectedCompany, setSelectedSignificantPersons }: Props) {

    const [companyId, setcompanyId] = useState("");
    const [company, setCompany] = useState();
    const [status, setStatus] = useState();
    const [errors, setErrors] = useState();

    useEffect(
        () => {
            setcompanyId(selectedCompany.companyId)
            setSelectedSignificantPersons();
            lookupSignificantPersons()
        },
        [selectedCompany.companyId]
    );


    const lookupSignificantPersons = async () => {
        setCompany(null);
        setErrors(null);
        setStatus("searching")
        const res = await requestCompanyShareholders(selectedCompany.companyId, selectedCompany.countryCode && selectedCompany.countryCode.toLowerCase());


        if (res.errors) {
            setStatus(null);
            console.log(res.errors)
            setErrors(res.errors);
        } else {
            console.log(res.shareholders)
            setCompany(res);
        }
    }

    const keyUp = (event: React.KeyboardEvent<HTMLDivElement>): void => {
        if (event.key === 'Enter') {
            event.preventDefault();
            event.stopPropagation();
            lookupSignificantPersons();
        }
    }

    return <div>
        {/* <Label>Persons with Signficant Control (List):</Label>
        <InputSt placeholder="Company Id" onKeyUp={keyUp} onChange={(event: any) => setcompanyId(event.target.value)} type="text" value={companyId} />
        <ButtonSt onClick={lookupSignificantPersons} type="button">Go!</ButtonSt> */}
        {/* {company && <ReactJson collapsed src={company} />} */}
        {company && company.shareholders && <Items>{company.shareholders
            // .filter((item: any) => !item.ceased_on)
            .filter((shareholder: any ) => shareholder.totalShareholdingPercentage && parseInt(shareholder.totalShareholdingPercentage) >= 3)
            .map((shareholder: any) => {
                let type = shareholder.exactMatches && shareholder.exactMatches[0] && shareholder.exactMatches[0].type;
                if (!type) {    
                    type = shareholder.notMatched && shareholder.notMatched.suspectedType
                }

                let companyId = shareholder.exactMatches && shareholder.exactMatches[0] && shareholder.exactMatches[0].company && shareholder.exactMatches[0].company.companyId

                return <li className={type} key={`${shareholder.sourceName}-${companyId}`}>
            <span title={shareholder.sourceName} className="title">{shareholder.sourceName}<br />{shareholder.totalShareholdingPercentage.toFixed(2)}%</span>
                    {type === "company" && companyId && <ShareHolder setSelectedSignificantPersons={setSelectedSignificantPersons} selectedCompany={{...shareholder, companyId, countryCode:selectedCompany.countryCode}} />}
                </li>
            })}</Items>}

        {errors && <Errors>
            {errors.map((error: any) => <li key={error.type}>{error.error}</li>)}
        </Errors>}
    </div>
}