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
        [selectedCompany.company_number]
    );



    const lookupSignificantPersonsAndDirectors = async () => {
        setCompanyOfficers(null);
        setSignificantPersons(null)
        setErrors(null);
        setStatus("searching")
        const significantPersonsRes = await requestSignificantPersons(selectedCompany.company_number);
        if (significantPersonsRes) {
            if (significantPersonsRes.errors) {
                setStatus(null);
                console.log(significantPersonsRes.errors)
                setErrors(significantPersonsRes.errors);
            } else if (significantPersonsRes &&
                significantPersonsRes.items) {
                const significantPersons = await Promise.all(significantPersonsRes.items.map(async (significantPerson: any) => {
                    if (!significantPerson.company_number && !significantPerson.date_of_birth) {
                        if (significantPerson.indentification && significantPerson.indentification.registration_number) {
                            significantPerson.company_number = significantPerson.indentification.registration_number
                        } else {
                            const company_number = await getCompanyIdFromSearch(significantPerson.name);
                            if (company_number !== "none") {
                                significantPerson.company_number = company_number;
                            }
                        }
                    }
                    return significantPerson;
                }))
                console.log("significantPersons", significantPersons)
                setSignificantPersons(significantPersons.filter((item: any) => !item.ceased_on)
                .filter((item: any) => !item.resigned_on));
            }
        }

        const res = await requestOfficers(selectedCompany.company_number);
        if (res) {
            if (res.errors) {
                setStatus(null);
                console.log(res.errors)
                setErrors(res.errors);
            } else if (res &&
                res.items) {
                const officers = await Promise.all(res.items.map(async (officer: any) => {
                    if (!officer.company_number && !officer.date_of_birth) {
                        if (officer.indentification && officer.indentification.registration_number) {
                            officer.company_number = officer.indentification.registration_number
                        } else {
                            const company_number = await getCompanyIdFromSearch(officer.name);
                            if (company_number !== "none") {
                                officer.company_number = company_number;
                            }
                        }
                    }
                    return officer;
                }))
                // console.log("officers", officers)
                setCompanyOfficers(officers.filter((item: any) => !item.ceased_on)
                    .filter((item: any) => !item.resigned_on));
            }
        }
    }

    const renderList = (list: Array<string>, type: string) => <Items>{
        list
            // .filter((item: any) => !item.date_of_birth)
            .map((item: any) => {
                let title = `${item.occupation && item.occupation.toLowerCase()} ${item.kind && item.kind.toLowerCase()} ${item.officer_role && item.officer_role.toLowerCase()}`;
                if (item.name) {
                    title = `${title || ""} ${(item.name.toLowerCase().includes("ltd") || item.name.toLowerCase().includes("limited") ? "limited-company" : "")}`;
                }
                title = title.toString().replace(/undefined/g, "")

                const isKnownPWSC = props.knownPWSC.indexOf(`${type}-${item.company_number}-${item.name}`) > -1;

                return <li className={title} key={`${item.name}-${item.date_of_birth}`}>
                    <span title={title} className="title">{item.name}
                        {item.company_number && <span style={{ fontSize: 10 }}> ({item.company_number})</span>}
                    </span>
                    {
                        item.company_number
                        && !isKnownPWSC
                        && <PersonsWithSignificantControl
                            knownPWSC={[...props.knownPWSC, `${type}-${item.company_number}-${item.name}`]}
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