
import React, { useState, useEffect } from "react";
// import CompanyLookup from './company';
import CompanySearch from './search-company'
import SignificantPersons from "./persons-with-significant-control";
import { requestCompanyOfficials, requestCompanyProfile, getCompanyIdFromSearch, saveCompanyStructure } from '../../utils/kyckr/request';
import { MainSt } from "../styles";
// import Officers from "./officers";
// import SignificantCorporateEntity from "./corporate-entity-with-significant-control";


export default function Kyckr() {

    const [selectedCompany, setSelectedCompany] = useState();
    const [selectedCountry, setSelectedCountry] = useState({ value: "GB", label: "United Kingdom 🇬🇧" });
    const [selectedOfficer, setSelectedOfficer] = useState();
    const [ignoreDB, setIgnoreDB] = useState(false);
    const [selectedSignificantPersons, setSelectedSignificantPersons] = useState();
    const [companyStructure, setCompanyStructure] = useState();
    const [hackValue, setHackValue] = useState(Math.random());

    const knownPWSC:Array<string>= [];

    useEffect(
        () => {
            if (selectedCompany && selectedCountry) {
                console.log("doit")
                startDoinIt();
            }
        },
        [selectedCompany, selectedCountry]
    );

    const startDoinIt = async () => {
        await doit(selectedCompany);
        setCompanyStructure(selectedCompany);
        setHackValue(Math.random())
        saveCompanyStructure(selectedCompany.CompanyID, selectedCountry.value, selectedCompany);
    }

    const doit = async (obj: any) => {
        const structure = await lookupSignificantPersons(obj.CompanyID, selectedCountry.value);
        obj.shareholders = structure?.shareholders
        obj.officers = structure?.officers
        setCompanyStructure(selectedCompany);
        setHackValue(Math.random()) 
        // saveCompanyStructure(selectedCompany.CompanyID, selectedCountry.value, selectedCompany);

        if (obj.shareholders && obj.shareholders.length > 0) {
            obj.shareholders.filter((sh: any) => sh.shareholderType === "C" && sh.CompanyID && knownPWSC.indexOf(sh.CompanyID) === -1).forEach(async (sh: any) => {
                await doit(sh)
                knownPWSC.push(sh.CompanyID);
                setCompanyStructure(selectedCompany);
                setHackValue(Math.random())
                // saveCompanyStructure(selectedCompany.CompanyID, selectedCountry.value, selectedCompany);
                // console.log("selectedCompany", selectedCompany)
            });
        } 
        // else {
        //     console.log("selectedCompany", selectedCompany)
        // }
    }


    const lookupSignificantPersons = async (companyID: any, selectedCountry: string) => {

        // console.log("lookupSignificantPersons", companyID, selectedCountry, objectPosition)

        // setCompanyOfficers(null);
        // setCompanyShareholders(null)
        // setErrors(null);
        // setStatus("searching")
        // const res = await requestCompanyOfficials(companyId);
        // company.shareholders: Array<any> = [];

        let shareholders: Array<any> = [];
        let officers: Array<any> = [];

        // console.log("selectedCompany", companyID)
        const res = await requestCompanyProfile(companyID, selectedCountry);
        // console.log("res", res)

        if (res) {
            if (res.errors) {
                // setStatus(null);
                // console.log(res.errors)
                // setErrors(res.errors);
            } else if (res) {
                if (res.shareHolders && res.shareHolders.items) {

                    // combine same / similar entities

                    // console.log(res.shareHolders.items)


                    const shareHoldersCombined: Array<any> = res.shareHolders.items;
                    const shareHoldersBeforeCombining: Array<any> = [];

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

                    shareholders = await Promise.all(shareHoldersCombined
                        .filter((sh: any) => {
                            if (!sh.percentage) {
                                return sh
                            } else if (sh.percentage > 1) {
                                return sh
                            }
                        })
                        .map(async (shareHolder: any, index: any, array: any) => {
                            if (!shareHolder.CompanyID && (!shareHolder.shareholderType || shareHolder.shareholderType === "C")) {
                                const CompanyID = await getCompanyIdFromSearch(shareHolder.name, selectedCountry);
                                if (CompanyID !== "none") {
                                    shareHolder.CompanyID = CompanyID;
                                }
                                // console.log("CompanyID", CompanyID)

                            }
                            return shareHolder;
                        }))

                }

                if (res.officers && res.officers.items) {
                    officers = await Promise.all(res.officers.items.map(async (officer: any, index: any, array: any) => {
                        if (!officer.CompanyID && !officer.birthdate) {
                            const CompanyID = await getCompanyIdFromSearch(officer.name, selectedCountry);
                            if (CompanyID !== "none") {
                                officer.CompanyID = CompanyID;
                            }
                        }
                        return officer;
                    }))
                    // console.log("officer", officers)
                    // setCompanyOfficers(officers)
                    // company.officers = officers

                }

                const company = {
                    shareholders, //shareHoldersCombined,
                    officers,
                }

                return company
            }
        }
    }
    // console.log(companyStructure)
    return (
        <MainSt>

            <CompanySearch setIgnoreDB={setIgnoreDB} ignoreDB={ignoreDB} setSelectedCompany={setSelectedCompany} selectedCountry={selectedCountry} setSelectedCountry={setSelectedCountry} />

            {companyStructure &&
                <SignificantPersons
                    companyStructure={companyStructure}
                // knownPWSC={[]} 
                // setSelectedSignificantPersons={setSelectedSignificantPersons} 
                // selectedCountry={selectedCountry.value} 
                // selectedCompany={selectedCompany} />}
                />
            }

            {/* selectedCompany && <Officers setSelectedOfficer={setSelectedOfficer} selectedCompany={selectedCompany} />} */}

            {/* {selectedCompany && <SignificantCorporateEntity selectedCompany={selectedCompany} />} */}

        </MainSt>
    )
}
