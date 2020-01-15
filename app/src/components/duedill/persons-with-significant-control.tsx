import React, { useState, useEffect } from 'react';
import {
    requestCompanyShareholders, requestCompanyPersonsOfSignificantControl,
    // getCompanyIdFromSearch 
} from '../../utils/duedill/request';
import { Items, OfficersSt, SignificantPersonsSt } from '../styles';
// import CorporateEntityWithSignificantControl from "./corporate-entity-with-significant-control";
import PersonsWithSignificantControl from "./persons-with-significant-control";
import ReactJson from 'react-json-view'

type Props = {
    selectedCompany: any,
    // setSelectedSignificantPersons: any,
    knownPWSC: Array<string>,
    ignoreDB: boolean
}

const totalShareholdingPercentageCutOff = 3;

export default function SignificantPersons(props: Props) {

    const {
        selectedCompany,
        // setSelectedSignificantPersons 
        ignoreDB
    } = props;

    // const [companyId, setcompanyId] = useState("");
    const [companyOfficers, setCompanyOfficers] = useState();
    const [significantPersons, setSignificantPersons] = useState();
    const [hideMinorShareholders, toggleHideMinorShareholders] = useState(true);
    const [status, setStatus] = useState();
    const [errors, setErrors] = useState();
    // const [knownPWSC, setKnownPWSC] = useState(props.knownPWSC)

    // console.log("selectedCompany.companyId", selectedCompany.companyId, selectedCompany)

    useEffect(
        () => {
            // setcompanyId(selectedCompany.company_number)
            // setSelectedSignificantPersons();
            lookupSignificantPersonsAndDirectors();
        },
        [selectedCompany.companyId]
    );



    const lookupSignificantPersonsAndDirectors = async () => {
        setCompanyOfficers(null);
        setSignificantPersons(null)
        setErrors(null);
        setStatus("searching")

        let countryCode = selectedCompany.countryCode && selectedCompany.countryCode;
        if (!countryCode) {
            if (selectedCompany.exactMatches && selectedCompany.exactMatches[0] && selectedCompany.exactMatches[0].company && selectedCompany.exactMatches[0].company.companyId) {
                countryCode = selectedCompany.exactMatches[0].company.countryCode;
            }
        }

        const significantPersonsRes = await requestCompanyPersonsOfSignificantControl(selectedCompany.companyId, countryCode, ignoreDB);
        if (significantPersonsRes) {
            if (significantPersonsRes.errors) {
                setStatus(null);
                console.log(significantPersonsRes.errors)
                setErrors(significantPersonsRes.errors);
            } else if (significantPersonsRes &&
                significantPersonsRes.items) {
                const significantPersons = await Promise.all(significantPersonsRes.items.map(async (significantPerson: any) => {

                    if (!significantPerson.companyId && !significantPerson.dateOfBirth) {

                        if (significantPerson.exactMatches && significantPerson.exactMatches[0] && significantPerson.exactMatches[0].company && significantPerson.exactMatches[0].company.companyId) {
                            significantPerson.companyId = significantPerson.exactMatches[0].company.companyId;
                        }
                        else if (significantPerson.indentification && significantPerson.indentification.registration_number) {
                            significantPerson.companyId = significantPerson.indentification.registration_number
                        } else {
                            // const companyId = await getCompanyIdFromSearch(significantPerson.name);
                            // if (companyId !== "none") {
                            //     significantPerson.companyId = companyIde;
                            // }
                        }
                    }
                    return significantPerson;
                }))
                setCompanyOfficers(significantPersons)
                // .filter((item: any) => item.ceasedOn === null)
                // .filter((item: any) => item.resignedOn === null));
            }
        }
        const res = await requestCompanyShareholders(selectedCompany.companyId, countryCode, ignoreDB);
        if (res) {
            if (res.errors) {
                setStatus(null);
                console.log(res.errors)
                setErrors(res.errors);
            } else if (res &&
                res.items) {
                const officers = await Promise.all(res.items.map(async (officer: any) => {

                    if (!officer.companyId && !officer.dateOfBirth) {
                        if (officer.exactMatches && officer.exactMatches[0] && officer.exactMatches[0].company && officer.exactMatches[0].company.companyId) {
                            officer.companyId = officer.exactMatches[0].company.companyId;
                        }
                        else if (officer.indentification && officer.indentification.registration_number) {
                            officer.companyId = officer.indentification.registration_number
                        }
                        else {
                            // const companyId = await getCompanyIdFromSearch(officer.name);
                            // if (companyId !== "none") {
                            //     officer.companyId = companyId;
                            // }
                        }
                    }
                    return officer;
                }))



                /*

                const shareHoldersCombined: Array<any> = [];
                    const shareHoldersBeforeCombining = res.shareHolders.items;
                    shareHoldersBeforeCombining.forEach((item: any, itemIndex: number) => {

                        if (!shareHoldersBeforeCombining[itemIndex].combined) {
                            const name = item.name;
                            let combinedPercentage = parseFloat(shareHoldersBeforeCombining[itemIndex].percentage);

                            res.shareHolders.items.forEach((sh: any, shIndex: number) => {
                                if (shIndex !== itemIndex && sh.name === name) {
                                    if (sh.percentage) {
                                        combinedPercentage += parseFloat(sh.percentage);
                                    }
                                    shareHoldersBeforeCombining[shIndex].combined = true;
                                }
                            });

                            shareHoldersBeforeCombining[itemIndex].combined = true;

                            shareHoldersCombined.push({ ...shareHoldersBeforeCombining[itemIndex], percentage: combinedPercentage });
                        }

                    });

                    console.log("shareHoldersBeforeCombining", shareHoldersBeforeCombining);
                    console.log("shareHoldersCombined", shareHoldersCombined);


                    setCompanyShareholders(shareHoldersBeforeCombining);

                */


                setSignificantPersons(officers)
                // .filter((item: any) => item.ceasedOn === null)
                //     .filter((item: any) => item.resignedOn === null));
            }
        }
    }

    const renderList = (list: Array<string>, type: string, showMore: boolean = false) => list.length > 0 && <Items>{
        list
            // .filter((item: any) => !item.dateOfBirth)

            /*



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
            })

            */


            .map((item: any) => {
                // let title = `${item.occupation && item.occupation.toLowerCase()} ${item.type && item.type.toLowerCase()} ${item.officerRole && item.officerRole.toLowerCase()}`;
                // if (item.name) {
                //     title = `${title || ""} ${(item.name.toLowerCase().includes("ltd") || item.name.toLowerCase().includes("limited") ? "limited-company" : "")}`;
                // }
                // title = title.toString().replace(/undefined/g, "")

                // console.log("item", item);

                let isCompany = false;
                let name;

                let type = item.exactMatches && item.exactMatches[0] && item.exactMatches[0].type;
                if (!type) {
                    type = item.notMatched && item.notMatched.suspectedType
                }
                if (!type) {
                    type = item.possibleMatches && item.possibleMatches[0] && item.possibleMatches[0].type
                }

                let companyId = item.exactMatches && item.exactMatches[0] && item.exactMatches[0].company && item.exactMatches[0].company.companyId
                if (!companyId) {
                    if (item.company) {
                        type = "company"
                        name = item.company.sourceName;
                    }
                }

                if (!name) {
                    name = item.sourceName || item.person && item.person.sourceName;
                }
                if (!name) {
                    name = item.exactMatches && item.exactMatches[0] && item.exactMatches[0].company && item.exactMatches[0].company.name
                }
 
                const isKnownPWSC = props.knownPWSC.indexOf(`${type}-${item.companyId}-${name}`) > -1;

                return <li className={type} key={`${name}-${companyId}`}>
                    <span title={name} className="title">{name}{companyId && <span style={{ fontSize: 9 }}><br />{companyId}</span>}


                        {item.totalShareholdingPercentage && <><br />
                            {item.totalShareholdingPercentage.toFixed(2)}%</>}


                    </span>
                    {/* {item.companyId && <span style={{ fontSize: 10 }}> ({item.companyId})</span>} */}

                    {
                        // item.companyId && 
                        (companyId || isCompany) &&
                        !isKnownPWSC
                        && <PersonsWithSignificantControl
                            ignoreDB={ignoreDB}
                            knownPWSC={[...props.knownPWSC, `${type}-${item.companyId}-${name}`]}
                            selectedCompany={item}
                        // setSelectedSignificantPersons={setSelectedSignificantPersons}
                        />
                    }
                </li>
            })}

{showMore && <li onClick={() => toggleHideMinorShareholders(!hideMinorShareholders)} style={{ padding: "30px 10px", whiteSpace: "pre", fontSize: 12 }}>{hideMinorShareholders ? "Show more ->" : "<- Hide "}</li>}

    </Items>
    return <>
        {(companyOfficers || significantPersons) && <Items>


            {significantPersons &&
                <SignificantPersonsSt>
                    {renderList(significantPersons.filter((sh: any) => { if (hideMinorShareholders) { return sh.totalShareholdingPercentage > totalShareholdingPercentageCutOff } else { return sh } }), "share", significantPersons.length > 10)}
                </SignificantPersonsSt>
}

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