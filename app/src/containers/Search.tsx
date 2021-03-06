import React, { useState, useEffect } from "react";
import { Redirect, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import CompanySearch from '../components/generic/search-company'
import { requestCompanyProfile } from '../utils/kyckr/request';
import { saveCompanyStructure } from '../utils/generic/request';
import { requestCompanyVitals, requestCompanyIndustries } from '../utils/duedill/request';
import { requestCompanyUBOStructure } from '../utils/generic/request';

import ScreeningStatus from '../components/screening-status';
import Button from '../components/button';
import Actions from '../layout/actions';
import { setCountry, setCompany, setCompanyStructure, setMarkets } from '../redux/actions/screening';
import { showLoader, hideLoader } from '../redux/actions/loader';

import * as Styled from "../components/styles";

const Search = (props: any) => {

    const {
        setCountry,
        setCompany,
        showLoader,
        hideLoader,
        setCompanyStructure,
        selectedCountry,
        selectedCompany,
        setMarkets,
        currentUser
    } = props;

    const [ignoreDB, setIgnoreDB] = useState(false);
    const [showDirectors, toggleShowDirectors] = useState(true);
    const [showOnlyOrdinaryShareTypes, toggleShowOnlyOrdinaryShareTypes] = useState(false)
    // const [hackValue, setHackValue] = useState(Math.random());
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

    if (!currentUser.admin) {
        return <Redirect to="/onboarding" />;
    }

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

    const startDoinIt = async (redirect: string = '/company-structure') => {
        const countryCode = selectedCompany.countryCode || selectedCountry.value;

        const { companyId, code, registrationAuthorityCode } = selectedCompany;

        let searchCode = companyId;

        // console.log(selectedCompany);

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
            // setHackValue(Math.random())
            setMarkets(['GB', 'DE', 'FR', 'IT', 'SE', 'RO']);
            hideLoader();
            props.history.push(redirect)
        } else {
            // console.log("UBOStructure", UBOStructure)
            setCompanyStructure(UBOStructure);
            // setHackValue(Math.random());
            setMarkets(['GB', 'DE', 'FR', 'IT', 'SE', 'RO']);
            hideLoader();
            props.history.push(redirect)
        }
    }

    const getCompanyProfile = async (companyId: any, searchCode: any, countryCode: any, registrationAuthorityCode: any, isNewSearch: boolean) => {

        const alreadyHaveCompanyProfile = requestedProfiles.indexOf(`${companyId}-${countryCode}`) > -1;
        if (!alreadyHaveCompanyProfile) {
            requestedProfiles.push(`${companyId}-${countryCode}`);
            const companyProfile = await requestCompanyProfile(companyId, searchCode, countryCode, orderReference(), (isNewSearch || ignoreDB), registrationAuthorityCode);
            if (companyProfile && companyProfile.shareholders) {

                for (let i = 0; i < companyProfile.shareholders.length; i++) {

                    if (companyProfile.shareholders[i].shareholderType?.value === "C" && companyProfile.shareholders[i].companyId?.value) {

                        const nextCompanyId = companyProfile.shareholders[i].companyId?.value;
                        const nextCompanySearchCode = companyProfile.shareholders[i].code?.value || companyProfile.shareholders[i].companyId?.value;
                        // added to ensure we use correct country code & registration authority code
                        const nextCountryCode = companyProfile.shareholders[i].countryCode?.value || countryCode;
                        const nextRegistrationAuthorityCode = companyProfile.shareholders[i].registrationAuthorityCode?.value || registrationAuthorityCode;

                        await new Promise(async (next) => {
                            await getCompanyProfile(nextCompanyId, nextCompanySearchCode, nextCountryCode, nextRegistrationAuthorityCode, isNewSearch);
                            next()
                        })
                    }
                }
            }
        }
    }

    const getStructure = (redirect: string) => {
        showLoader();
        startDoinIt(redirect);
    }

    return (
        <Styled.MainSt>
            <ScreeningStatus />

            <Styled.Content>
                <div style={{ padding: '100px 0 200px 0' }}>
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
                    <Button onClick={() => getStructure('/company-structure')} disabled={!(selectedCompany && selectedCompany.companyId && selectedCountry)} />
                </Actions>
            </Styled.Content>
        </Styled.MainSt>
    )
}

const mapStateToProps = (state: any) => ({
    currentUser: state.auth.user,
    selectedCompany: state.screening.company,
    selectedCountry: state.screening.country,
});

const actions = { setCompany, setCountry, setMarkets, setCompanyStructure, showLoader, hideLoader };

export const RawComponent = Search;

export default connect(mapStateToProps, actions)(withRouter(Search));
