import React, { useState, useEffect } from 'react';
import { requestCompanyShareholders } from '../../utils/duedill/request';
import { MainSt, InputSt, ButtonSt, Company, Errors, Label, Items } from '../styles';
import ShareHolders from "./shareholders";
import ReactJson from 'react-json-view'

type Props = {
    selectedCompany: any,
    setSelectedSignificantPersons: any
}

export default function CompamyShareholders({ selectedCompany, setSelectedSignificantPersons }: Props) {

    const [companyId, setcompanyId] = useState("");
    const [shareholders, setShareholders] = useState();
    const [status, setStatus] = useState();
    const [errors, setErrors] = useState();

    useEffect(
        () => {
            setcompanyId(selectedCompany.companyId)
            setSelectedSignificantPersons();
            lookupShareholders()
        },
        [selectedCompany.companyId]
    );


    const lookupShareholders = async () => {
        setShareholders(null);
        setErrors(null);
        setStatus("searching")
        console.log(`looking up shareholders for company Id ${selectedCompany.companyId}`)
        if (selectedCompany.companyId) {
            const res = await requestCompanyShareholders(selectedCompany.companyId, selectedCompany.countryCode && selectedCompany.countryCode.toLowerCase());
            if (res.errors) {
                setStatus(null);
                console.log(res.errors)
                setErrors(res.errors);
            } else {
                setShareholders(res.items);
            }
        }
    }

    // const keyUp = (event: React.KeyboardEvent<HTMLDivElement>): void => {
    //     if (event.key === 'Enter') {
    //         event.preventDefault();
    //         event.stopPropagation();
    //         lookupShareholders();
    //     }
    // }

    return <div>
        {/* <Label>Persons with Signficant Control (List):</Label>
        <InputSt placeholder="Company Id" onKeyUp={keyUp} onChange={(event: any) => setcompanyId(event.target.value)} type="text" value={companyId} />
        <ButtonSt onClick={lookupSignificantPersons} type="button">Go!</ButtonSt> */}
        {/* {company && <ReactJson collapsed src={company} />} */}
        {shareholders && <Items>{shareholders
            // .filter((item: any) => !item.ceased_on)
            .filter((shareholder: any) => shareholder.totalShareholdingPercentage && parseInt(shareholder.totalShareholdingPercentage) >= 3)
            .map((shareholder: any) => {
                let type = shareholder.exactMatches && shareholder.exactMatches[0] && shareholder.exactMatches[0].type;
                if (!type) {
                    type = shareholder.notMatched && shareholder.notMatched.suspectedType
                }

                let companyId = shareholder.exactMatches && shareholder.exactMatches[0] && shareholder.exactMatches[0].company && shareholder.exactMatches[0].company.companyId

                return <li className={type} key={`${shareholder.sourceName}-${companyId}`}>
                    <span title={shareholder.sourceName} className="title">{shareholder.sourceName}{companyId && <span style={{ fontSize: 9 }}><br />{companyId}</span>}<br />{shareholder.totalShareholdingPercentage.toFixed(2)}%</span>
                    {
                        // type === "company" && companyId && 
                        <ShareHolders setSelectedSignificantPersons={setSelectedSignificantPersons} selectedCompany={{ ...shareholder, companyId, countryCode: selectedCompany.countryCode }} />}
                </li>
            })}</Items>}

        {errors && <Errors>
            {errors.map((error: any) => <li key={error.type}>{error.error}</li>)}
        </Errors>}
    </div>
}