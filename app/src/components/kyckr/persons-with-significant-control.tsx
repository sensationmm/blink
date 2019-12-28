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
    const [companyDirectors, setCompanyDirectors] = useState();
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
        setCompanyDirectors(null);
        setCompanyShareholders(null)
        setErrors(null);
        setStatus("searching")
        // const res = await requestCompanyOfficials(companyId);
        console.log("selectedCompany", selectedCompany.CompanyID)
        const res = await requestCompanyProfile(selectedCompany.CompanyID, props.selectedCountry);

        if (res) {
            if (res.errors) {
                setStatus(null);
                console.log(res.errors)
                setErrors(res.errors);
            } else if (res &&
                res.CompanyProfileResult &&
                res.CompanyProfileResult.CompanyProfile &&
                res.CompanyProfileResult.CompanyProfile.directorAndShareDetails) {


                const profile = {
                    shareHolders: undefined,
                    directors: undefined
                }
                const { directorAndShareDetails } = res.CompanyProfileResult.CompanyProfile;

                if (directorAndShareDetails.shareHolders &&
                    directorAndShareDetails.shareHolders.ShareholderDetails) {
                    const shareHolders = await Promise.all(directorAndShareDetails.shareHolders.ShareholderDetails.map(async (shareHolder: any, index: any, array: any) => {
                        // console.log(shareHolder)
                        if (!shareHolder.CompanyID) {
                            const CompanyID = await getCompanyIdFromSearch(shareHolder.name, props.selectedCountry);
                            if (CompanyID !== "none") {
                                shareHolder.CompanyID = CompanyID;
                            }
                            // console.log("CompanyID", CompanyID)

                        }
                        return shareHolder;
                    }))
                    // console.log(shareHolders)
                    setCompanyShareholders(shareHolders);

                }

                if (directorAndShareDetails.directors &&
                    directorAndShareDetails.directors.Director) {
                    const directors = await Promise.all(directorAndShareDetails.directors.Director.map(async (director: any, index: any, array: any) => {
                        if (!director.CompanyID && !director.birthdate) {
                            // console.log(director)
                            const CompanyID = await getCompanyIdFromSearch(director.name, props.selectedCountry);
                            if (CompanyID !== "none") {
                                director.CompanyID = CompanyID;
                            }
                        }
                        return director;
                    }))
                    setCompanyDirectors(directors)

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

    // console.log(knownPWSC)

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
        {(companyDirectors || companyShareholders) && <Items>
            {
                companyShareholders &&
                companyShareholders
                    .filter((item: any) => !item.ceased_on)
                    .map((item: any) => {
                        let title = item.title;
                        if (item.name) {
                            title = `${item.title} ${(item.name.toLowerCase().includes("ltd") || item.name.toLowerCase().includes("limited") ? "limited-company" : "")}`;
                        }

                        const isKnownPWSC = knownPWSC.indexOf(`share-${JSON.stringify(item)}`) > -1;

                        return <li className={title} key={`${item.name}-${item.birthdate}`}>
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

            {

                companyDirectors &&
                companyDirectors
                    .filter((item: any) => !item.ceased_on)
                    // .filter((item: any) => !item.birthdate)
                    .map((item: any) => {
                        let title = item.title;
                        if (item.name) {
                            title = `${item.title} ${(item.name.toLowerCase().includes("ltd") || item.name.toLowerCase().includes("limited") ? "limited-company" : "")}`;
                        }

                        const isKnownPWSC = knownPWSC.indexOf(`dir-${JSON.stringify(item)}`) > -1;

                        if (!isKnownPWSC) {
                            setKnownPWSC(knownPWSC.concat(`dir-${JSON.stringify(item)}`));
                        }

                        return <li className={title} key={`${item.name}-${item.birthdate}`}>
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