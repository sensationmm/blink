
import React, { useState } from "react";
// import CompanyLookup from './company';
import CompanySearch from './search-company'
import Shareholders from "./shareholders";
import PersonsWithSignificantControl from "./persons-with-significant-control";
import { MainSt } from "../styles";
// import Officers from "./officers";
// import SignificantCorporateEntity from "./corporate-entity-with-significant-control";


export default function Kyckr() {

    const [selectedCompany, setSelectedCompany] = useState()
    const [selectedOfficer, setSelectedOfficer] = useState()
    const [selectedSignificantPersons, setSelectedSignificantPersons] = useState()

    return (
        <MainSt>

            <CompanySearch setSelectedCompany={setSelectedCompany} />

            {selectedCompany && <Shareholders setSelectedSignificantPersons={setSelectedSignificantPersons} selectedCompany={selectedCompany} />}


            {/* {selectedCompany && <PersonsWithSignificantControl setSelectedSignificantPersons={setSelectedSignificantPersons} selectedCompany={selectedCompany} />} */}

            {/* selectedCompany && <Officers setSelectedOfficer={setSelectedOfficer} selectedCompany={selectedCompany} />} */}

            {/* {selectedCompany && <SignificantCorporateEntity selectedCompany={selectedCompany} />} */}

        </MainSt>
    )
}
