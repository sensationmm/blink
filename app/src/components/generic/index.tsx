
import React, { useState, useEffect } from "react";
// import CompanyLookup from './company';
import CompanySearch from './search-company'
import SignificantPersons from "./persons-with-significant-control";
import {
    // requestCompanyOfficials, 
    requestCompanyProfile, getCompanyIdFromSearch, saveCompanyStructure
} from '../../utils/kyckr/request';
import { requestCompanyUBOStructure } from '../../utils/generic/request';
import { MainSt } from "../styles";
// import Officers from "./officers";
// import SignificantCorporateEntity from "./corporate-entity-with-significant-control";


export default function Kyckr() {

    const [selectedCompany, setSelectedCompany] = useState();
    const [selectedCountry, setSelectedCountry] = useState([{ value: "GB", label: "United Kingdom 🇬🇧" }, { value: "IE", label: "Ireland 🇮🇪" }]);
    const [selectedOfficer, setSelectedOfficer] = useState();
    const [ignoreDB, setIgnoreDB] = useState(false);
    const [selectedSignificantPersons, setSelectedSignificantPersons] = useState();
    const [companyStructure, setCompanyStructure] = useState();
    const [showDirectors, toggleShowDirectors] = useState(true);
    const [hackValue, setHackValue] = useState(Math.random());
    const [shareholderRange, changeShareholderRange] = useState(10);

    const knownPWSC: Array<string> = [];

    useEffect(
        () => {
            if (selectedCompany && selectedCountry) {
                console.log("doit")
                startDoinIt();
            } else {
                setCompanyStructure(null)
            }
        },
        [selectedCompany, selectedCountry]
    );

    const startDoinIt = async () => {
        const companyStructure = await requestCompanyUBOStructure("kyckr", selectedCompany.companyId, selectedCompany.countryCode);

        if (ignoreDB || companyStructure === "not found") {
            console.log("company structure not found - begin build");
            await doit(selectedCompany);
            setCompanyStructure(selectedCompany);
            setHackValue(Math.random())
            saveCompanyStructure(selectedCompany.companyId, selectedCompany.countryCode, selectedCompany, ignoreDB);
        } else {
            console.log("company structure found");
            setCompanyStructure(companyStructure);
            setHackValue(Math.random())
        }
    }

    const doit = async (obj: any) => {
        const structure = await lookupSignificantPersons(obj.companyId || obj.CompanyID, selectedCompany.countryCode);
        obj.shareholders = structure?.shareholders
        obj.officers = structure?.officers
        setCompanyStructure(selectedCompany);
        setHackValue(Math.random())
        // saveCompanyStructure(selectedCompany.companyId, selectedCountry.value, selectedCompany, ignoreDB);

        if (obj.shareholders && obj.shareholders.length > 0) {
            obj.shareholders
                .filter((sh: any) => sh.shareholderType === "C" && sh.CompanyID && knownPWSC.indexOf(sh.CompanyID) === -1)
                .forEach(async (sh: any) => {
                    await doit(sh)
                    knownPWSC.push(sh.CompanyID);
                    // setCompanyStructure(selectedCompany);
                    setHackValue(Math.random()) // for react to re-render
                    saveCompanyStructure(selectedCompany.companyId, selectedCompany.countryCode, selectedCompany, ignoreDB);
                });
        }
    }


    const lookupSignificantPersons = async (companyId: any, country: string) => {

        let shareholders: Array<any> = [];
        let officers: Array<any> = [];

        // console.log("selectedCompany", companyId)
        const res = await requestCompanyProfile(companyId, country);
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
                        .map(async (shareHolder: any, index: any, array: any) => {
                            if (!shareHolder.CompanyID && (!shareHolder.shareholderType || shareHolder.shareholderType === "C")) {
                                const CompanyID = await getCompanyIdFromSearch(shareHolder.name, selectedCountry.map((s: any) => s.value));
                                console.log("CompanyID", CompanyID)
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
                            const CompanyID = await getCompanyIdFromSearch(officer.name, selectedCountry.map((s: any) => s.value));
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

                console.log("company", company)

                return company
            }
        }
    }
    // console.log(companyStructure)
    return (
        <MainSt>

            <CompanySearch
                shareholderRange={shareholderRange}
                changeShareholderRange={changeShareholderRange}
                toggleShowDirectors={toggleShowDirectors}
                showDirectors={showDirectors}
                setIgnoreDB={setIgnoreDB}
                ignoreDB={ignoreDB}
                setSelectedCompany={setSelectedCompany}
                selectedCountry={selectedCountry}
                setSelectedCountry={setSelectedCountry}
            />

            {companyStructure &&
                <SignificantPersons
                    shareholderRange={shareholderRange}
                    companyStructure={companyStructure}
                    showDirectors={showDirectors}
                />
            }

        </MainSt>
    )
}
