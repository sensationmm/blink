import React, { useState, useEffect } from "react";
import { filingSearch, productOrder, productList } from '../../utils/kyckr/request';
import { MainSt, Label, InputSt, ButtonSt } from "../styles";
import styled from "styled-components";
import SearchCompany from "../generic/search-company";

const LabelSt = styled(Label)`

    &.link:hover {
        text-decoration: underline; 
    }

    input {
        display: block;
        margin: 5px 0;
    }
`

const Row = styled.div`
    clear: both;
    margin: 20px auto 0;
    display: block;
    // float: left;
    width: 800px;
`

const Table = styled.table`
    td, th {
        padding: 10px 20px 10px 0px;
    }
    th {
        text-align: left;
    }
`

// :companyCode/:registrationAuthority/:countryISOCode/:orderReference


export default function FilingSearch() {


    let t: any;

    const [selectedCompany, setSelectedCompany] = useState({
        companyId: "",
        registrationAuthority: "",
        registrationAuthorityCode: "",
    });
    const [selectedCountry, setSelectedCountry] = useState({ value: "GB", label: "United Kingdom 🇬🇧" });
    const [registrationAuthorityCode, setRegistrationAuthorityCode] = useState();
    const [companyId, setCompanyId] = useState();
    const [filings, setFilings] = useState();
    const [previousOrders, setPreviousOrders] = useState();

    useEffect(
        () => {
            setFilings(null);
            if (selectedCountry) {
                setRegistrationAuthorityCode(selectedCompany.registrationAuthorityCode);
                setCompanyId(selectedCompany.companyId);
            }

            if (!previousOrders) {
                requestProductList();
            }
        },
        [selectedCompany, selectedCountry]
    );

    const doFillingSearch = async () => {
        const filings = await filingSearch(companyId, registrationAuthorityCode, selectedCountry.value);
        setFilings(filings?.FilingSearchResult?.Products?.ProductDTO);
    }

    const orderProduct = async (Id: string) => {
        const result = await productOrder(companyId, registrationAuthorityCode, selectedCountry.value, Id);
        console.log("result", result);
        if (result.ProductOrderResult) {
            clearTimeout(t);
            requestProductList();
        }
    }

    const requestProductList = async () => {
        const previousOrders = await productList();
        setPreviousOrders(previousOrders)
        t = setTimeout(requestProductList, 30000);
        // console.log("previousOrders", previousOrders);
    }

    return (
        <MainSt>
            <SearchCompany
                setSelectedCompany={setSelectedCompany}
                setIgnoreDB={() => { }}
                toggleShowDirectors={() => { }}
                changeShareholderThreshold={() => { }}
                toggleShowOnlyOrdinaryShareTypes={() => { }}
                showControls={false}
                ignoreDB={false}
                selectedCountry={selectedCountry}
                shareholderThreshold={100}
                showDirectors={true}
                setSelectedCountry={setSelectedCountry}
                showOnlyOrdinaryShareTypes={false}
            />
            {/* <Row>
                <CountrySelector float="left" isMulti={false} onChange={setSelectedCountry} value={selectedCountry} />
            </Row> */}
            <Row>
                <LabelSt htmlFor="companyId">Company Code:
                <InputSt onChange={(e: any) => setCompanyId(e.target.value)} type="text" id="companyId" value={companyId}
                    // onChange={setCompanyCode} 
                    />
                </LabelSt>
            </Row>
            <Row>
                {(selectedCountry.value === "DE" || selectedCountry.value === "IT") &&
                    <LabelSt htmlFor="registrationAuthority">Registration Authority:
                <InputSt onChange={(e: any) => setRegistrationAuthorityCode(e.target.value)} type="text" id="registrationAuthority" value={registrationAuthorityCode}
                        // onChange={seRegistrationAuthority} 
                        />
                    </LabelSt>}
            </Row>

            <Row>
                <ButtonSt type="button" onClick={doFillingSearch}>Go</ButtonSt>
            </Row>

            <Row>
                {filings && <Table>
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Format</th>
                            <th style={{ width: 200 }} >Price</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {filings.map((filing: any) => {
                            //filing.Id.substring(filing.Id.length - 25)

                            const found = previousOrders.ProductListResult.ProductOrderDTO
                                // .slice(0, 1)
                                .find((p: any) => {
                                    const stringToFind = p?.OrderReference.split("-").pop();
                                    // console.log(stringToFind.length)
                                    return stringToFind.length > 0 && filing.Id.indexOf(stringToFind) > -1
                                });
                                if (found) {
                                    console.log(found)
                                }

                            return <tr key={filing.Id}>
                                <td>
                                    {filing.ProductTitle}
                                </td>
                                <td>
                                    {filing.ProductFormat}
                                </td>
                                <td>
                                    {/* {filing.Currency} */}
                                    {filing.Price}
                                </td>
                                <td>
                                    {
                                    found ? 
                                    found.AVAILABLE === 1 ? 
                                    <a href={found.Url} rel="noopener noreferrer" target="_blank"> Download </a> :
                                    <LabelSt>Awaiting Delivery - Ordered: {found.OrderDateTime}</LabelSt>
                                    : 
                                    <LabelSt className="link" onClick={() => orderProduct(filing.Id)}>Order</LabelSt>}
                                </td>
                            </tr>
                        }
                        )}
                    </tbody>
                </Table>}
            </Row>

        </MainSt>
    )
}
