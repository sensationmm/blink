
import React, { useState, useEffect } from "react";
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import CompanySearch from '../components/generic/search-company'
import {
    requestCompanyProfile
} from '../utils/kyckr/request';
import {
    getCompanyIdFromSearch,
    saveCompanyStructure
} from '../utils/generic/request';
import { requestCompanyVitals, requestCompanyIndustries } from '../utils/duedill/request';
import { requestCompanyUBOStructure } from '../utils/generic/request';
import { MainSt } from "../components/styles";

import ScreeningStatus from '../components/screening-status';
import Button from '../components/button';
import Actions from '../layout/actions';

import { setCountry, setCompany, setCompanyStructure } from '../redux/actions/screening';
import { showLoader, hideLoader } from '../redux/actions/loader';

const Search = (props: any) => {

    const {
        setCountry,
        setCompany,
        showLoader,
        hideLoader,
        setCompanyStructure,
        selectedCountry,
        selectedCompany
    } = props;

    const [ignoreDB, setIgnoreDB] = useState(false);
    const [showDirectors, toggleShowDirectors] = useState(true);
    const [showOnlyOrdinaryShareTypes, toggleShowOnlyOrdinaryShareTypes] = useState(false)
    const [hackValue, setHackValue] = useState(Math.random());
    const [shareholderRange, changeShareholderRange] = useState(10);

    useEffect(
        () => {
            if (selectedCompany && selectedCompany.companyId && selectedCountry) {
                console.log("doit")
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
        showLoader();
        const countryCode = company.countryCode || selectedCountry.value;

        if (company.companyId) {

            let returnCompany = company;

            const companyVitals = await requestCompanyVitals(company.companyId, countryCode.toLowerCase());

            if (companyVitals.httpCode !== 404 && companyVitals.httpCode !== 400) {
                returnCompany = { ...returnCompany, ...companyVitals };
            }

            const companyIndustries = await requestCompanyIndustries(company.companyId, countryCode.toLowerCase());

            if (companyIndustries.httpCode !== 404 && companyIndustries.httpCode !== 400) {
                returnCompany = { ...returnCompany, ...companyIndustries };
            }

            setCompany(returnCompany);
        } else {
            setCompany(null)
        }
        hideLoader();
    }

    const requestedProfiles: any = [];

    const startDoinIt = async () => {
        const countryCode = selectedCompany.countryCode || selectedCountry.value;

        const { companyId, code, registrationAuthorityCode } = selectedCompany;

        let searchCode = companyId;

        console.log(selectedCompany);

        if ((countryCode === "DE" || countryCode === "IT" || countryCode === "RO") && code) {
            searchCode = code; // for DE it's a proprietary code;
        }

        let UBOStructure = await requestCompanyUBOStructure(companyId, countryCode); // we always save with companyId, not a proprietary code

        console.log("UBOStructure", UBOStructure)

        if (ignoreDB || UBOStructure === "not found") {
            console.log("company structure not found - begin build");

            await saveCompanyStructure({ ...selectedCompany, searchName: selectedCompany?.name?.toLowerCase() }, ignoreDB);
            console.log("saveCompanyStructure complete")
            await getCompanyProfile(companyId, searchCode, countryCode, registrationAuthorityCode, true);
            UBOStructure = await requestCompanyUBOStructure(companyId, countryCode);
            setCompanyStructure(UBOStructure);
            setHackValue(Math.random())
            hideLoader();
            props.history.push('/company-structure')
        } else {
            setCompanyStructure(UBOStructure);
            setHackValue(Math.random());
            hideLoader();
            props.history.push('/company-structure')
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
            }
        }
    }

    const getStructure = () => {
        showLoader();
        startDoinIt();
    }

    return (
        <MainSt>
            <ScreeningStatus activeStep={'/search'} />

            <div style={{ padding: '100px 0 300px 0' }}>
                <CompanySearch
                    shareholderThreshold={shareholderRange}
                    changeShareholderThreshold={changeShareholderRange}
                    toggleShowDirectors={toggleShowDirectors}
                    showDirectors={showDirectors}
                    toggleShowOnlyOrdinaryShareTypes={toggleShowOnlyOrdinaryShareTypes}
                    showOnlyOrdinaryShareTypes={showOnlyOrdinaryShareTypes}
                    setIgnoreDB={setIgnoreDB}
                    ignoreDB={ignoreDB}
                    showControls={false}
                    selectedCompany={selectedCompany}
                    setSelectedCompany={getCompanyVitalsAndSetSelectedCompany}
                    selectedCountry={selectedCountry}
                    setSelectedCountry={setCountry}
                />
            </div>

            <Actions>
                <Button onClick={getStructure} disabled={!(selectedCompany && selectedCompany.companyId && selectedCountry)} />
            </Actions>
        </MainSt>
    )
}

const mapStateToProps = (state: any) => ({
    selectedCompany: state.screening.company,
    selectedCountry: state.screening.country,
});

const actions = { setCompany, setCountry, setCompanyStructure, showLoader, hideLoader };

export const RawComponent = Search;

export default connect(mapStateToProps, actions)(withRouter(Search));
