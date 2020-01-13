import React, { useState, useEffect } from 'react';
import { requestCompanyOfficials, requestCompanyProfile, getCompanyIdFromSearch } from '../../utils/kyckr/request';
import { MainSt, InputSt, ButtonSt, Company, Errors, Label, Items } from '../styles';
// import CorporateEntityWithSignificantControl from "./corporate-entity-with-significant-control";
import PersonsWithSignificantControl from "./persons-with-significant-control";
import ReactJson from 'react-json-view'

type Props = {
    selectedCompany: any,
    setSelectedSignificantPersons: any,
    selectedCountry: any,
    knownPWSC: Array<string>
}

export default function SignificantPersons(props: Props) {

    const { selectedCompany, setSelectedSignificantPersons } = props;

    const [companyId, setcompanyId] = useState("");
    const [companyOfficers, setCompanyOfficers] = useState();
    const [companyShareholders, setCompanyShareholders] = useState();
    const [status, setStatus] = useState();
    const [errors, setErrors] = useState();
    const [knownPWSC, setKnownPWSC] = useState(props.knownPWSC)

    useEffect(
        () => {
            setcompanyId(selectedCompany.CompanyID)
            setSelectedSignificantPersons();
            lookupSignificantPersons();
            // console.log("useEffect")
        },
        [selectedCompany.companyId]
    );



    const lookupSignificantPersons = async () => {
        setCompanyOfficers(null);
        setCompanyShareholders(null)
        setErrors(null);
        setStatus("searching")
        // const res = await requestCompanyOfficials(companyId);
        console.log("selectedCompany", selectedCompany.CompanyID)
        const res = await requestCompanyProfile(selectedCompany.CompanyID, props.selectedCountry);
        console.log("res", res)
        if (res) {
            if (res.errors) {
                setStatus(null);
                console.log(res.errors)
                setErrors(res.errors);
            } else if (res) {
                if (res.shareHolders && res.shareHolders.items) {

                    // combine same / similar entities

                    // console.log(res.shareHolders.items)

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




                    // console.log("res.shareHolders.items", res.shareHolders.items)
                    const shareHolders = await Promise.all(shareHoldersBeforeCombining
                        .filter((sh:any) => {
                            if (!sh.percentage) {
                                return sh
                            } else if (sh.percentage > 5) {
                                return sh
                            }
                        })
                        .map(async (shareHolder: any, index: any, array: any) => {
                            if (!shareHolder.CompanyID && (!shareHolder.shareholderType || shareHolder.shareholderType === "C")) {
                                const CompanyID = await getCompanyIdFromSearch(shareHolder.name, props.selectedCountry);
                                if (CompanyID !== "none") {
                                    shareHolder.CompanyID = CompanyID;
                                }
                                console.log("CompanyID", CompanyID)

                            }
                            return shareHolder;
                        }))
                    // console.log(shareHolders.map((sh: any) => { return { shareholderType: sh.shareholderType, name: sh.name } }))
                    setCompanyShareholders(shareHolders);

                }

                if (res.officers && res.officers.items) {
                    const officers = await Promise.all(res.officers.items.map(async (officer: any, index: any, array: any) => {
                        if (!officer.CompanyID && !officer.birthdate) {
                            const CompanyID = await getCompanyIdFromSearch(officer.name, props.selectedCountry);
                            if (CompanyID !== "none") {
                                officer.CompanyID = CompanyID;
                            }
                        }
                        return officer;
                    }))
                    // console.log("officer", officers)
                    setCompanyOfficers(officers)

                }

                // if (directorAndShareDetails.directors &&
                //     directorAndShareDetails.directors.Director) {
                //     setCompanyProfile({ ...companyProfile, directors: directorAndShareDetails.directors.Director });

                // }
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

        {(companyOfficers || companyShareholders) && <Items>
            {
                companyShareholders &&
                companyShareholders
                    .filter((item: any) => !item.ceased_on)
                    .map((item: any) => {
                        let title = item.title;
                        if (item.name) {
                            title = `${item.title} ${(item.name.toLowerCase().includes("ltd") || item.name.toLowerCase().includes("limited") || item.shareholderType === "C" ? "limited-company" : "")} ${item.shareholderType === "P" ? "person" : ""}`;
                        }

                        const isKnownPWSC = knownPWSC.indexOf(`share-${JSON.stringify(item)}`) > -1;

                        return <li className={title} key={`${item.name}-${item.birthdate}-${Math.random()}`}>
                            <span title={title} className="title">{item.name}
                                {item.CompanyID && <span style={{ fontSize: 10 }}> ({item.CompanyID}) </span>}
                                {item.percentage && <><br /><span style={{ fontSize: 10 }}> {`${item.percentage}%`} </span></>}
                            </span>

                            {
                                item.CompanyID && !isKnownPWSC && <PersonsWithSignificantControl
                                    selectedCountry={props.selectedCountry}
                                    knownPWSC={knownPWSC.concat(`share-${JSON.stringify(item)}`)}
                                    selectedCompany={item}
                                    setSelectedSignificantPersons={setSelectedSignificantPersons}
                                />
                            }
                        </li>
                    })}

            {

                companyOfficers &&
                companyOfficers
                    .filter((item: any) => !item.ceased_on)
                    // .filter((item: any) => !item.birthdate)
                    .map((item: any) => {
                        let title = item.title;
                        if (item.name) {
                            title = `${item.title} ${(item.name.toLowerCase().includes("ltd") || item.name.toLowerCase().includes("limited") || item.shareholderType === "P" ? "person" : "")}`;
                        }

                        const isKnownPWSC = knownPWSC.indexOf(`dir-${JSON.stringify(item)}`) > -1;

                        if (!isKnownPWSC) {
                            setKnownPWSC(knownPWSC.concat(`dir-${JSON.stringify(item)}`));
                        }

                        return <li className={title} key={`${item.name}-${item.birthdate}-${Math.random()}`}>
                            <span title={title} className="title">{item.name}
                                {item.CompanyID && <span style={{ fontSize: 10 }}> ({item.CompanyID})</span>}
                            </span>
                            {
                                item.CompanyID && !isKnownPWSC && <PersonsWithSignificantControl
                                    selectedCountry={props.selectedCountry}
                                    knownPWSC={knownPWSC.concat(`share-${JSON.stringify(item)}`)}
                                    selectedCompany={item}
                                    setSelectedSignificantPersons={setSelectedSignificantPersons}
                                />
                            }
                        </li>
                    })}


        </Items>}

        {errors && <Errors>
            {errors.map((error: any) => <li key={error.type}>{error.error}</li>)}
        </Errors>}
    </>
}