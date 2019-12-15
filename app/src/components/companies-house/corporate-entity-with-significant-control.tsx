import React, { useState, useEffect } from 'react';
import { requestSignificantCorporateEntity } from '../../utils/request';
import { MainSt, InputSt, ButtonSt, Company, Errors } from './styles';
import ReactJson from 'react-json-view'

type Props = {
    pscId: string,
    companyId: string,
}

export default function SignificantCorporateEntity( props: Props ) {

    const [pscId, setPscId] = useState("");
    const [corporateEntity, setCorporateEntity] = useState();
    const [status, setStatus] = useState();
    const [errors, setErrors] = useState();

    useEffect(
        () => setPscId(props.pscId)
    );


    const lookupSignificantCorporateEntity = async () => {
        setPscId("");
        setErrors(null);
        setStatus("searching")
        const res = await requestSignificantCorporateEntity(props.companyId, pscId);


        if (res.errors) {
            setStatus(null);
            console.log(res.errors)
            setErrors(res.errors);
        } else {
            setCorporateEntity(res);
        }
    }

    const keyUp = (event: React.KeyboardEvent<HTMLDivElement>): void => {
        if (event.key === 'Enter') {
            event.preventDefault();
            event.stopPropagation();
            lookupSignificantCorporateEntity();
        }
    }

    return <>
        {/* <Label>Corporate Entity with Signficant Control:</Label> */}
        <InputSt placeholder="pscId" onKeyUp={keyUp} onChange={(event: any) => setPscId(event.target.value)} type="text" value={pscId} />
        <ButtonSt onClick={lookupSignificantCorporateEntity} type="button">Go!</ButtonSt>
        {corporateEntity && <Company>
            {corporateEntity.company_name}
        </Company>}

        {corporateEntity && <ReactJson src={corporateEntity} />}
        {errors && <Errors>
            {errors.map((error: any) => <li key={error.type}>{error.error}</li>)}
        </Errors>}
    </>
}