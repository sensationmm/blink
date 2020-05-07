import React, { useState } from 'react';
import { Actions, Banner } from './styles';
import Button from "../../components/button";
import * as Styled from '../../components/styles';
import ReactJson from "react-json-view";
import styled from "styled-components";

const ConnectXero = styled.div`
    position: relative;
    top: -100px;
    left: 100px;
`

const Xero = (props: any) => {

    const initialTabs: any = [
        {
            name: "Accounts", method: props.xeroGetBankAccounts
        },
        { name: "Invoices", method: props.xeroGetInvoices },
    ]
    const [activeTab, setActiveTab] = useState();
    const [tabs, setTabs] = useState(initialTabs);
    const [accountIdToDelete, setAccountIdToDelete] = useState("");
    const [accountIdToToggleStatus, setAccountIdToToggleStatus] = useState("");
    const [changeAccountStatusToArchived, setChangeAccountStatusToArchived] = useState(true);
    const [accountFilter, setAccountFilter] = useState("ANY");
    const [searchString, setSearchString] = useState("");
    const filterAccountTypes = ["Any", "Bank", "Revenue", "DirectCosts", "Expense", "Current", "Inventory", "Fixed", "Currliab", "termLiab", "Equity"]

    const toggleAccountStatusAndRefreshData = async () => {
        const result = await props.xeroToggleAccountStatus(accountIdToToggleStatus, changeAccountStatusToArchived ? "ARCHIVED" : "ACTIVE");
        if (result.refresh) {
            onSelectTab(tabs.find((a: any) => a.name === "Accounts"))
        }
    }

    const renderDeleteAccountInput = () => <>
        <Styled.Label>Delete acount:</Styled.Label>
        <Styled.InputWrapper>
            <div>
                <Styled.InputSt type="text" placeholder="Account Id" value={accountIdToDelete} onChange={e => setAccountIdToDelete(e.target.value)} style={{ width: "90%" }} />
            </div>
            <div>
                <Button onClick={() => props.xeroDeleteBankAccount(accountIdToDelete)} label="Go" small />
            </div>
        </Styled.InputWrapper>
    </>

    const renderSearchInput = () => <>
        <Styled.Label>Search:</Styled.Label>
        <Styled.InputWrapper>
            <div>
                <Styled.InputSt type="text" placeholder="Text" value={searchString} onChange={e => setSearchString(e.target.value)} style={{ width: "90%" }} />
            </div>
        </Styled.InputWrapper>
    </>

    const renderToggleAccountStatusInput = () => <>
        <Styled.Label>Toggle account status - "ARCHIVED?": <input type="checkbox" checked={changeAccountStatusToArchived} onChange={(e: any) => setChangeAccountStatusToArchived(e.target.checked)} /></Styled.Label>
        <Styled.InputWrapper>
            <div>
                <Styled.InputSt type="text" placeholder="Account Id" value={accountIdToToggleStatus} onChange={e => setAccountIdToToggleStatus(e.target.value)} style={{ width: "90%" }} />
            </div>
            <div>
                <Button onClick={() => toggleAccountStatusAndRefreshData()} label="Go" small />
            </div>
        </Styled.InputWrapper>
    </>

    const xeroIntegration = props.auth.user ?.xero;

    const renderXero = () => {

        const uId = props.auth.user ?.localId;

        return <>
            {xeroIntegration && <>
                <Styled.Tabs>
                    {tabs.map((tab: any) => <li key={tab.name} className={activeTab ?.name === tab.name ? "active" : ""}>
                        <button onClick={() => onSelectTab(tab)}>{tab.name}</button></li>
                    )}
                </Styled.Tabs>

                {
                    activeTab ?.name === "Accounts" && <>
                        {renderDeleteAccountInput()}
                        <br /><br />
                        {renderToggleAccountStatusInput()}
                        <br /><br />
                        {renderSearchInput()}
                    </>
            }
                <>
                    {activeTab ?.data && <>
                        {
                            activeTab ?.name === "Accounts" && <><div>
                                <br /><br />
                                <Styled.Label>Filter Account Type:</Styled.Label>
                                {
                                    filterAccountTypes.map((filterAccountType: any) =>
                                        <span key={filterAccountType}>{filterAccountType} <input style={{ marginRight: 20 }} type="radio" name="accountType" checked={accountFilter === filterAccountType.toUpperCase()} onChange={() => setAccountFilter(filterAccountType.toUpperCase())} /></span>
                                    )
                                }

                            </div></>}
                        <ReactJson collapsed src={activeTab ?.data[activeTab ?.name] ?.filter((item: any) => {
                            if (activeTab ?.name === "Accounts" && accountFilter !== "ANY") {
                                return item.Type === accountFilter
                            }
                            return item;
                        }).filter((item: any) => {
                            if (searchString !== "") {
                                return item.Name.toLowerCase().indexOf(searchString.toLowerCase()) > -1
                            }
                            return item
                        })} />
                    </>}
                </>
            </>}
            <>
                {
                    !xeroIntegration && <Banner>
                        <h1>Integrations</h1>

                        Connecting your blink account to Xero takes seconds,
                        and makes accounting simpler than ever
    
                    <ul>
                            <li>Link accounts</li>
                            <li>Approve or reject transactions</li>
                            <li>Categorise expenses</li>
                            <li>Reconcile</li>
                        </ul>

                    </Banner>
                }

                <Actions>
                    {xeroIntegration && <Button onClick={() => props.xeroDisconnect()} label="Disconnect Xero"></Button>}
                    {!xeroIntegration && <ConnectXero><Button onClick={() => props.xeroAuthenticate(uId)} label="Connect Xero" /></ConnectXero>}
                </Actions>
            </>
        </>
    }

    const onSelectTab = async (newActiveTab: any) => {
        setActiveTab(newActiveTab);
        const uId = props.auth.user ?.localId;
        if (typeof newActiveTab.method === "function") {
            const result = await newActiveTab.method(uId);
            setTabs(tabs.map((tab: any) => {
                if (tab.name === newActiveTab.name) {
                    tab.data = result
                }
                return tab
            }));
        }
        setActiveTab(newActiveTab);
    }

    if (activeTab === undefined && !!xeroIntegration) {
        onSelectTab(tabs[0]);
    }



    return renderXero()
}

export default Xero;