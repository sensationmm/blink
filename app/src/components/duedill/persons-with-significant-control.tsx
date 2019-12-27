import React, { useState, useEffect } from 'react';
import { requestCompanyPersonsOfSignificantControl } from '../../utils/duedill/request';
import { MainSt, InputSt, ButtonSt, Company, Errors, Label, Items } from '../styles';
import PersonsWithSignificantControl from "./persons-with-significant-control";
import ReactJson from 'react-json-view'

type Props = {
    selectedCompany: any,
    setSelectedSignificantPersons: any
}

export default function CompamyPersonsWithSignificantControl({ selectedCompany, setSelectedSignificantPersons }: Props) {

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
        console.log(`looking up persons with control for company Id ${selectedCompany.companyId}`)
        const res = await requestCompanyPersonsOfSignificantControl(selectedCompany.companyId, selectedCompany.countryCode && selectedCompany.countryCode.toLowerCase());


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

    return <>
        {company && company.personsOfSignificantControl &&  company.personsOfSignificantControl.length > 0 && <Items>
            {/* <Label>Persons with Signficant Control (List):</Label>
        <InputSt placeholder="Company Id" onKeyUp={keyUp} onChange={(event: any) => setcompanyId(event.target.value)} type="text" value={companyId} />
        <ButtonSt onClick={lookupSignificantPersons} type="button">Go!</ButtonSt> */}
            {/* {company && <ReactJson collapsed src={company} />} */}
            {company && company.personsOfSignificantControl
                // .filter((item: any) => !item.ceased_on)
                // .filter((shareholder: any ) => shareholder.totalShareholdingPercentage && parseInt(shareholder.totalShareholdingPercentage) >= 3)
                .map((shareholder: any) => {
                    let type = shareholder.exactMatches && shareholder.exactMatches[0] && shareholder.exactMatches[0].type;
                    if (!type) {
                        type = shareholder.notMatched && shareholder.notMatched.suspectedType
                    }

                    let companyId = shareholder && shareholder.exactMatches && shareholder.exactMatches[0] && shareholder.exactMatches[0].company && shareholder.exactMatches[0].company.companyId
                    const sourceName = shareholder && shareholder.company && shareholder.company.sourceName;



                    return <li className={type} key={`${sourceName}-${companyId}`}>
                        <span title={sourceName} className="title">{sourceName}{companyId && <span style={{ fontSize: 9 }}><br />{companyId}</span>}<br />{shareholder.totalShareholdingPercentage && shareholder.totalShareholdingPercentage.toFixed(2)}%</span>
                        {
                            // type === "company" && companyId && 
                            <PersonsWithSignificantControl setSelectedSignificantPersons={setSelectedSignificantPersons} selectedCompany={{ ...shareholder, companyId, countryCode: selectedCompany.countryCode }} />}
                    </li>
                })}

            {errors && <Errors>
                {errors.map((error: any) => <li key={error.type}>{error.error}</li>)}
            </Errors>}
        </Items>
        }
    </>
}