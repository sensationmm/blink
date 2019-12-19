
import React, { useState } from "react";
import { HeaderSt } from '../styles';
// import CompanyLookup from './company';
import CompanySearch from './search-company'
import SignificantPersons from "./persons-with-significant-control";
import Officers from "./officers";
// import SignificantCorporateEntity from "./corporate-entity-with-significant-control";


export default function CompaniesHouse() {

    const [selectedCompany, setSelectedCompany] = useState()
    const [selectedOfficer, setSelectedOfficer] = useState()
    const [selectedSignificantPersons, setSelectedSignificantPersons] = useState()

    return (
        <>
            <HeaderSt>
                Companies house lookup
            </HeaderSt>

            <CompanySearch setSelectedCompany={setSelectedCompany} />

            {selectedCompany && <SignificantPersons setSelectedSignificantPersons={setSelectedSignificantPersons} selectedCompany={selectedCompany} />}

            {selectedCompany && <Officers setSelectedOfficer={setSelectedOfficer} selectedCompany={selectedCompany} />}

            {/* {selectedCompany && <SignificantCorporateEntity selectedCompany={selectedCompany} />} */}

        </>
    )
}
