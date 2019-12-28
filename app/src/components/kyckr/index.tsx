
import React, { useState } from "react";
// import CompanyLookup from './company';
import CompanySearch from './search-company'
import SignificantPersons from "./persons-with-significant-control";
import { MainSt } from "../styles";
// import Officers from "./officers";
// import SignificantCorporateEntity from "./corporate-entity-with-significant-control";


export default function Kyckr() {

    const [selectedCompany, setSelectedCompany] = useState()
    const [selectedCountry, setSelectedCountry] = useState({value: "GB", label: "United Kingdom 🇬🇧" })
    const [selectedOfficer, setSelectedOfficer] = useState()
    const [selectedSignificantPersons, setSelectedSignificantPersons] = useState()
    return (
        <MainSt>

            <CompanySearch setSelectedCompany={setSelectedCompany} selectedCountry={selectedCountry} setSelectedCountry={setSelectedCountry} />

            {selectedCompany && 
                <SignificantPersons 
                    knownPWSC={[]} 
                    setSelectedSignificantPersons={setSelectedSignificantPersons} 
                    selectedCountry={selectedCountry.value} 
                    selectedCompany={selectedCompany} />}

            {/* selectedCompany && <Officers setSelectedOfficer={setSelectedOfficer} selectedCompany={selectedCompany} />} */}

            {/* {selectedCompany && <SignificantCorporateEntity selectedCompany={selectedCompany} />} */}

        </MainSt>
    )
}
