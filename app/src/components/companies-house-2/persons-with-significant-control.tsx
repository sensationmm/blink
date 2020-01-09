import React, { useState, useEffect } from 'react';
import { requestSignificantPersons, requestOfficers, getCompanyIdFromSearch } from '../../utils/companies-house/request';
import { Items, OfficersSt, SignificantPersonsSt } from '../styles';
// import CorporateEntityWithSignificantControl from "./corporate-entity-with-significant-control";
import PersonsWithSignificantControl from "./persons-with-significant-control";
import ReactJson from 'react-json-view'

type Props = {
    selectedCompany: any,
    // setSelectedSignificantPersons: any,
    knownPWSC: Array<string>
}

export default function SignificantPersons(props: Props) {

    const {
        selectedCompany,
        // setSelectedSignificantPersons 
    } = props;

    // const [companyId, setcompanyId] = useState("");
    const [companyOfficers, setCompanyOfficers] = useState();
    const [significantPersons, setSignificantPersons] = useState();
    const [status, setStatus] = useState();
    const [errors, setErrors] = useState();
    // const [knownPWSC, setKnownPWSC] = useState(props.knownPWSC)

    useEffect(
        () => {
            // setcompanyId(selectedCompany.company_number)
            // setSelectedSignificantPersons();
            lookupSignificantPersonsAndDirectors();
        },
        [selectedCompany.companyNumber]
    );



    const lookupSignificantPersonsAndDirectors = async () => {
        setCompanyOfficers(null);
        setSignificantPersons(null)
        setErrors(null);
        setStatus("searching")
        const significantPersonsRes = await requestSignificantPersons(selectedCompany.companyNumber);
        if (significantPersonsRes) {
            if (significantPersonsRes.errors) {
                setStatus(null);
                console.log(significantPersonsRes.errors)
                setErrors(significantPersonsRes.errors);
            } else if (significantPersonsRes &&
                significantPersonsRes.items) {
                const significantPersons = await Promise.all(significantPersonsRes.items.map(async (significantPerson: any) => {
                    if (!significantPerson.companyNumber && !significantPerson.dateOfBirth) {
                        if (significantPerson.indentification && significantPerson.indentification.registration_number) {
                            significantPerson.companyNumber = significantPerson.indentification.registration_number
                        } else {
                            const companyNumber = await getCompanyIdFromSearch(significantPerson.name);
                            if (companyNumber !== "none") {
                                significantPerson.companyNumber = companyNumber;
                            }
                        }
                    }
                    return significantPerson;
                }))
                setSignificantPersons(significantPersons.filter((item: any) => item.ceasedOn === null)
                .filter((item: any) => item.resignedOn === null));
            }
        }
        const res = await requestOfficers(selectedCompany.companyNumber);
        if (res) {
            if (res.errors) {
                setStatus(null);
                console.log(res.errors)
                setErrors(res.errors);
            } else if (res &&
                res.items) {
                const officers = await Promise.all(res.items.map(async (officer: any) => {
                    if (!officer.companyNumber && !officer.dateOfBirth) {
                        if (officer.indentification && officer.indentification.registration_number) {
                            officer.companyNumber = officer.indentification.registration_number
                        } else {
                            const companyNumber = await getCompanyIdFromSearch(officer.name);
                            if (companyNumber !== "none") {
                                officer.companyNumber = companyNumber;
                            }
                        }
                    }
                    return officer;
                }))
                setCompanyOfficers(officers.filter((item: any) => item.ceasedOn === null)
                    .filter((item: any) => item.resignedOn === null));
            }
        }
    }

    const renderList = (list: Array<string>, type: string) => <Items>{
        list
            // .filter((item: any) => !item.dateOfBirth)
            .map((item: any) => {
                let title = `${item.occupation && item.occupation.toLowerCase()} ${item.type && item.type.toLowerCase()} ${item.officerRole && item.officerRole.toLowerCase()}`;
                if (item.name) {
                    title = `${title || ""} ${(item.name.toLowerCase().includes("ltd") || item.name.toLowerCase().includes("limited") ? "limited-company" : "")}`;
                }
                title = title.toString().replace(/undefined/g, "")

                const isKnownPWSC = props.knownPWSC.indexOf(`${type}-${item.companyNumber}-${item.name}`) > -1;

                return <li className={title} key={`${item.name}-${item.dateOfBirth}`}>
                    <span title={title} className="title">{item.name}
                        {item.companyNumber && <span style={{ fontSize: 10 }}> ({item.companyNumber})</span>}
                    </span>
                    {
                        item.companyNumber && 
                        !isKnownPWSC
                        && <PersonsWithSignificantControl
                            knownPWSC={[...props.knownPWSC, `${type}-${item.companyNumber}-${item.name}`]}
                            selectedCompany={item}
                        // setSelectedSignificantPersons={setSelectedSignificantPersons}
                        />
                    }
                </li>
            })}</Items>

    return <>
        {(companyOfficers || significantPersons) && <Items>

            {significantPersons && significantPersons.length > 0 && <SignificantPersonsSt>
                {renderList(significantPersons, "share")}
            </SignificantPersonsSt>}

            {
                companyOfficers && companyOfficers.length > 0 && <OfficersSt>
                    {renderList(companyOfficers, "dir")}
                </OfficersSt>
            }

            {/* {errors &&
                errors.map((error: any) => <li key={error.type}><span>{error.error}</span></li>)} */}

        </Items>
        }
    </>
}