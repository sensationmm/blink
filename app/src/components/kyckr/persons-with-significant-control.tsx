import React, { useState, useEffect } from 'react';
import { requestCompanyOfficials, requestCompanyProfile } from '../../utils/kyckr/request';
import { MainSt, InputSt, ButtonSt, Company, Errors, Label, Items } from '../styles';
// import CorporateEntityWithSignificantControl from "./corporate-entity-with-significant-control";
import PersonsWithSignificantControl from "./persons-with-significant-control";
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
            setcompanyId(selectedCompany.CompanyID)
            setSelectedSignificantPersons();
            lookupSignificantPersons()
        },
        [selectedCompany.CompanyID]
    );



    const lookupSignificantPersons = async () => {
        setCompany(null);
        setErrors(null);
        setStatus("searching")
        // const res = await requestCompanyOfficials(companyId);
        console.log("selectedCompany", selectedCompany.CompanyID)
        const res = await requestCompanyProfile(selectedCompany.CompanyID);

        if (res) {
            if (res.errors) {
                setStatus(null);
                console.log(res.errors)
                setErrors(res.errors);
            } else {
                setCompany(res);
            }
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
        {/* <Label>Persons with Signficant Control (List):</Label>
        <InputSt placeholder="Company Id" onKeyUp={keyUp} onChange={(event: any) => setcompanyId(event.target.value)} type="text" value={companyId} />
        <ButtonSt onClick={lookupSignificantPersons} type="button">Go!</ButtonSt> */}
        {/* {company && <ReactJson collapsed src={company} />} */}
        {/* {company && 
            company.CompanyOfficialsResult && 
            company.CompanyOfficialsResult.CompanyOfficials && 
            company.CompanyOfficialsResult.CompanyOfficials.Officials && 
            company.CompanyOfficialsResult.CompanyOfficials.Officials.OfficialDTO && 
            <Items>{company.CompanyOfficialsResult.CompanyOfficials.Officials.OfficialDTO 
            // .filter((item: any) => !item.ceased_on)
            .map((item: any) => <li className={item.Function} key={`${item.FirstName}-${item.LastName}-${item.DateOfBirth}`}><span title={item.Function} className="title">{`${item.FirstName} ${item.FamilyName}`}</span>
                {/* {item.kind === "corporate-entity-person-with-significant-control" && <CorporateEntityWithSignificantControl companyId={companyId} pscId={item.links.self.split("/").slice(-1)[0] } />} */}
        {/* </li>)}</Items>} */}
        {company &&
            company.CompanyProfileResult && <Items>
                {
                    company &&
                    company.CompanyProfileResult &&
                    company.CompanyProfileResult.CompanyProfile &&
                    company.CompanyProfileResult.CompanyProfile.directorAndShareDetails &&
                    company.CompanyProfileResult.CompanyProfile.directorAndShareDetails.shareHolders &&
                    company.CompanyProfileResult.CompanyProfile.directorAndShareDetails.shareHolders.ShareholderDetails &&


                    company.CompanyProfileResult.CompanyProfile.directorAndShareDetails.shareHolders.ShareholderDetails
                        .filter((item: any) => !item.ceased_on)
                        .map((item: any) =>
                            <li className={item.title} key={`${item.name}-${item.birthdate}`}>
                                <span title={item.title} className="title">{item.name}</span>
                                {
                                    item.directorNumber && <PersonsWithSignificantControl
                                        selectedCompany={{ ...item, CompanyID: item.directorNumber }}
                                        setSelectedSignificantPersons={setSelectedSignificantPersons}
                                    />
                                }
                            </li>
                        )}

                {
                    company &&
                    company.CompanyProfileResult &&
                    company.CompanyProfileResult.CompanyProfile &&
                    company.CompanyProfileResult.CompanyProfile.directorAndShareDetails &&
                    company.CompanyProfileResult.CompanyProfile.directorAndShareDetails.directors &&
                    company.CompanyProfileResult.CompanyProfile.directorAndShareDetails.directors.Director &&


                    company.CompanyProfileResult.CompanyProfile.directorAndShareDetails.directors.Director
                        .filter((item: any) => !item.ceased_on)
                        .map((item: any) =>
                            <li className={item.title} key={item.name}>
                                <span title={item.title} className="title">{item.name}</span>
                                {
                                    item.directorNumber && <PersonsWithSignificantControl
                                        selectedCompany={{ ...item, CompanyID: item.directorNumber }}
                                        setSelectedSignificantPersons={setSelectedSignificantPersons}
                                    />
                                }
                            </li>
                        )

                }
            </Items>}

        {errors && <Errors>
            {errors.map((error: any) => <li key={error.type}>{error.error}</li>)}
        </Errors>}
    </>
}