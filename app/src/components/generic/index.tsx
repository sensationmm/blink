
import React, { useState, useEffect } from "react";
// import CompanyLookup from './company';
import CompanySearch from './search-company'
// import CompanySearch from '../opencorporates/search-company';
// import CompanySearch from '../duedill/search-company';
import SignificantPersons from "./persons-with-significant-control";
import {
    // requestCompanyOfficials, 
    requestCompanyProfile
} from '../../utils/kyckr/request';
import {
    getCompanyIdFromSearch,
    saveCompanyStructure
} from '../../utils/generic/request';
import { requestCompanyVitals } from '../../utils/duedill/request';
// import {
//     getCompanyIdFromSearch
// } from '../../utils/opencorporates/request';
import { requestCompanyUBOStructure } from '../../utils/generic/request';
import { MainSt } from "../styles";
// import Officers from "./officers";
// import SignificantCorporateEntity from "./corporate-entity-with-significant-control";


// const testCDEompany: any = { code: "DE001/0/DE16416642", companyId: "HRB 149890 B"};

export default function Kyckr() {

    const [selectedCompany, setSelectedCompany] = useState();
    const [selectedCountry, setSelectedCountry] = useState(
        // { value: "DE", label: "Germany 🇩🇪" }
        { value: "GB", label: "United Kingdom 🇬🇧" }
    );
    
    // const [selectedOfficer, setSelectedOfficer] = useState();
    const [ignoreDB, setIgnoreDB] = useState(false);
    // const [selectedSignificantPersons, setSelectedSignificantPersons] = useState();
    const [companyStructure, setCompanyStructure] = useState();
    const [showDirectors, toggleShowDirectors] = useState(true);
    const [showOnlyOrdinaryShareTypes, toggleShowOnlyOrdinaryShareTypes] = useState(false)
    const [hackValue, setHackValue] = useState(Math.random());
    const [shareholderRange, changeShareholderRange] = useState(10);

    // const knownPWSC: Array<string> = [];

    // requestCompanyProfile("08430008", "GB", "11fs-test", true)

    useEffect(
        () => {
            if (selectedCompany && selectedCompany.companyId && selectedCountry) {
                console.log("doit")
                startDoinIt();
            } else {
                setCompanyStructure(null)
            }
        },
        [selectedCompany, selectedCountry]
    );

    const orderReference = () => {
        const countryCode = selectedCompany.countryCode || selectedCountry.value;
        return `11fs-${countryCode}-${selectedCompany.companyId}`;
    }

    const getCompanyVitalsAndSetSelectedCompany = async (company: any) => {
        const countryCode = company.countryCode || selectedCountry.value;
        // need to figure out how to get vitals for DE
        if (company.companyId) {
            const companyVitals = await requestCompanyVitals(company.companyId, countryCode.toLowerCase());
            if (companyVitals.httpCode !== 404) {
                setSelectedCompany({ ...company, ...companyVitals });
            } else {
                setSelectedCompany({ ...company })
            }
        }
    }

    const requestedProfiles: any = [];

    const startDoinIt = async () => {

        const countryCode = selectedCompany.countryCode || selectedCountry.value;

        const { companyId, code, registrationAuthorityCode } = selectedCompany;

        const searchCode = code || companyId // for DE it's a proprietary code


        let UBOStructure = await requestCompanyUBOStructure(companyId, countryCode); // we always save with companyId, not a proprietary code
        setCompanyStructure(UBOStructure);
            setHackValue(Math.random())

        if (ignoreDB || UBOStructure === "not found") {
            console.log("company structure not found - begin build");

            // console.log(selectedCountry)

            await saveCompanyStructure({ ...selectedCompany, searchName: selectedCompany?.name?.toLowerCase()}, ignoreDB);
            console.log("saveCompanyStructure complete")
            await getCompanyProfile(companyId, searchCode, countryCode, registrationAuthorityCode, true);
            UBOStructure = await requestCompanyUBOStructure(companyId, countryCode);
            // console.log("UBOStructure", UBOStructure)
            setCompanyStructure(UBOStructure);
            setHackValue(Math.random())
        }
    }

    const getCompanyProfile = async (companyId: any, searchCode: any, countryCode: any, registrationAuthorityCode: any, isNewSearch: boolean) => {

        const alreadyHaveCompanyProfile = requestedProfiles.indexOf(`${companyId}-${countryCode}`) > -1;
        if (!alreadyHaveCompanyProfile) {
            requestedProfiles.push(`${companyId}-${countryCode}`);
            const companyProfile = await requestCompanyProfile(companyId, searchCode, countryCode, orderReference(), (isNewSearch || ignoreDB), registrationAuthorityCode);
            if (companyProfile && companyProfile.shareholders) {

                for (let i = 0; i < companyProfile.shareholders.length; i++) { 
                    if (companyProfile.shareholders[i].shareholderType === "C" && companyProfile.shareholders[i].companyId) {

                        const nextCompanyId = companyProfile.shareholders[i].companyId;
                        const nextCompanySearchCode = companyProfile.shareholders[i].code || companyProfile.shareholders[i].companyId;

                        await new Promise(async (next) => {
                            await getCompanyProfile(nextCompanyId, nextCompanySearchCode, countryCode, registrationAuthorityCode, isNewSearch);
                            next()
                        })    
                    }
                        
                }

                // await Promise.all(companyProfile.shareholders.map(async (shareholder: any) => {
                //     console.log(shareholder.shareholderType, shareholder.companyId)
                //     if (shareholder.shareholderType === "C" && shareholder.companyId) {

                //         const nextCompanyId = shareholder.companyId;
                //         const nextCompanySearchCode = shareholder.code || shareholder.companyId
                //         await getCompanyProfile(nextCompanyId, nextCompanySearchCode, countryCode, registrationAuthorityCode, isNewSearch, companyProfile.entitiesAdded);
                //     }
                // }));
                const UBOStructure = await requestCompanyUBOStructure(companyId, countryCode);
                setCompanyStructure(UBOStructure);
                setHackValue(Math.random())

            }
            else {
                const UBOStructure = await requestCompanyUBOStructure(companyId, countryCode);
                setCompanyStructure(UBOStructure);
                setHackValue(Math.random())
            }
        }

    }

    return (
        <MainSt>

            <CompanySearch
                shareholderRange={shareholderRange}
                changeShareholderRange={changeShareholderRange}
                toggleShowDirectors={toggleShowDirectors}
                showDirectors={showDirectors}
                toggleShowOnlyOrdinaryShareTypes={toggleShowOnlyOrdinaryShareTypes}
                showOnlyOrdinaryShareTypes={showOnlyOrdinaryShareTypes}
                setIgnoreDB={setIgnoreDB}
                ignoreDB={ignoreDB}
                showControls={true}
                setSelectedCompany={getCompanyVitalsAndSetSelectedCompany}
                selectedCountry={selectedCountry}
                setSelectedCountry={setSelectedCountry}
            />

            {companyStructure &&
                <SignificantPersons
                    showOnlyOrdinaryShareTypes={showOnlyOrdinaryShareTypes}
                    shareholderRange={shareholderRange}
                    companyStructure={companyStructure}
                    showDirectors={showDirectors}
                />
            }

        </MainSt>
    )
}
