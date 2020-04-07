import React, { useState } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import {
  xeroDisconnect,
  xeroDeleteBankAccount,
  xeroConnectBankAccount,
  xeroToggleAccountStatus,
  xeroGetBankAccounts,
  revolutGetBankAccount,
  revolutGetBankAccounts,
  // revolutGetBankAccountDetails,
  revolutGetBankAccountTransactions,
  revolutGetCounterparties,
  revolutPostPayment
} from '../redux/actions/integrations';
import User from './User';
import { xeroAuthenticate, xeroGetInvoices } from '../utils/integrations/request';
import { Actions } from './modal-styles';
import ReactJson from "react-json-view";
import * as Styled from '../components/styles';
import Button from "../components/button";

import Revolut from "../components/integrations/revolut";

const Integrations = (props: any) => {

  const initialTabs: any = [
    {
      name: "Accounts", method: props.xeroGetBankAccounts
    },
    { name: "Invoices", method: xeroGetInvoices },
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

  const renderXero = () => {
    const xeroIntegration = props.auth.user ?.xero;
    const uId = props.auth.user ?.localId;

    return <>
      {xeroIntegration && <>
        <Styled.Tabs>
          {tabs.map((tab: any) => <li key={tab.name} className={activeTab ?.name === tab.name ? "active" : ""}>
            <a onClick={() => onSelectTab(tab)}>{tab.name}</a></li>
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
      <Actions style={{ position: "fixed", zIndex: -1 }}>
        {xeroIntegration && <Button onClick={() => props.xeroDisconnect()} label="Disconnect Xero"></Button>}
        {!xeroIntegration && <Button onClick={() => xeroAuthenticate(uId)} label="Connect Xero"></Button>}
      </Actions>
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

  const provider = props.match.params.provider;


  if (provider === undefined || provider === "xero") {
    if (activeTab === undefined) {
      onSelectTab(tabs[0]);
    }
  }

  return <Styled.MainSt>
    <User />
    <Styled.Content>
      {(provider === undefined || provider === "xero")
        && renderXero()}
      {(provider === undefined || provider === "revolut") &&
        <Revolut
          revolutGetBankAccounts={props.revolutGetBankAccounts}
          revolutGetBankAccount={props.revolutGetBankAccount}
          // revolutPostPayment={props.revolutPostPayment}
          revolutGetCounterparties={props.revolutGetCounterparties}
          revolutGetBankAccountTransactions={props.revolutGetBankAccountTransactions}
          revolutPostPayment={props.revolutPostPayment} />}
    </Styled.Content>

  </Styled.MainSt>
};

const mapStateToProps = (state: any) => ({
  auth: state.auth,
});

const actions = {
  xeroDisconnect,
  xeroGetBankAccounts,
  xeroConnectBankAccount,
  xeroDeleteBankAccount,
  xeroToggleAccountStatus,
  revolutGetBankAccount,
  revolutGetBankAccounts,
  // revolutGetBankAccountDetails,
  revolutGetCounterparties,
  revolutGetBankAccountTransactions,
  revolutPostPayment
};

export default withRouter(connect(mapStateToProps, actions)(Integrations));
