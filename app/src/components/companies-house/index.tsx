
import React from "react";
import { HeaderSt } from './styles';
import CompanyLookup from './company';
import SignificantPersons from "./persons-with-significant-control";


export default function CompaniesHouse() {

    return (
        <>
            <HeaderSt>
                Companies house lookup
            </HeaderSt>

            <CompanyLookup />

            <SignificantPersons />

        </>
    )
}
