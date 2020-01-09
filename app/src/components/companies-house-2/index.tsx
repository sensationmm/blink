
import React, { useState } from "react";
// import CompanyLookup from './company';
import CompanySearch from './search-company'
import SignificantPersons from "./persons-with-significant-control";
import { MainSt } from "../styles";
// import Officers from "./officers";
// import SignificantCorporateEntity from "./corporate-entity-with-significant-control";


export default function CompaniesHouse() {

    const [selectedCompany, setSelectedCompany] = useState()
    const [selectedOfficer, setSelectedOfficer] = useState()
    // const [selectedSignificantPersons, setSelectedSignificantPersons] = useState()
    return (
        <MainSt>

            <CompanySearch setSelectedCompany={(setSelectedCompany)} />

            {selectedCompany && 
                <SignificantPersons 
                    knownPWSC={[]} 
                    // setSelectedSignificantPersons={setSelectedSignificantPersons} 
                    selectedCompany={{...selectedCompany, companyNumber: selectedCompany.company_number}} />}

            {/* selectedCompany && <Officers setSelectedOfficer={setSelectedOfficer} selectedCompany={selectedCompany} />} */}

            {/* {selectedCompany && <SignificantCorporateEntity selectedCompany={selectedCompany} />} */}

        </MainSt>
    )
}
