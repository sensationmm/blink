import React, { useState } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { xeroDisconnect, xeroDeleteBankAccount, xeroToggleAccountStatus, xeroGetBankAccounts } from '../redux/actions/integrations';
import User from './User';
import { xeroAuthenticate, xeroGetInvoices } from '../utils/integrations/request';
import { Actions } from './modal-styles';
import ReactJson from "react-json-view";
import * as Styled from '../components/styles';
import Button from "../components/button";


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
          activeTab?.name === "Accounts" && <>
            {renderDeleteAccountInput()}
            <br /><br />
            {renderToggleAccountStatusInput()}
          </>
        }
        <>
          {activeTab ?.data && <>
            {
              activeTab?.name === "Accounts" && <><div>
                <br /><br />
                <Styled.Label>Filter Account Type:</Styled.Label>
                {/* <Styled.InputWrapper> */}
                  {
                    filterAccountTypes.map((filterAccountType: any) =>
                      <span key={filterAccountType}>{filterAccountType} <input style={{ marginRight: 20 }} type="radio" name="accountType" checked={accountFilter === filterAccountType.toUpperCase()} onChange={() => setAccountFilter(filterAccountType.toUpperCase())} /></span>
                    )
                  }
                {/* </Styled.InputWrapper> */}

              </div></>}
            <ReactJson collapsed src={activeTab ?.data[activeTab ?.name].filter((item: any) => {
              if (activeTab ?.name === "Accounts" && accountFilter !== "ANY") {
                return item.Type === accountFilter
              }
              return item;
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
    console.log("newActiveTab", newActiveTab);
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

  if (activeTab === undefined) {
    onSelectTab(tabs[0]);
  }

  const provider = props.match.params.provider;
  return <Styled.MainSt>
    <User />
    <Styled.Content>
      {(provider === undefined || provider === "xero")
        && renderXero()}
    </Styled.Content>
  </Styled.MainSt>
};

const mapStateToProps = (state: any) => ({
  auth: state.auth,
});

const actions = {
  xeroDisconnect,
  xeroGetBankAccounts,
  xeroDeleteBankAccount,
  xeroToggleAccountStatus,
};

export default withRouter(connect(mapStateToProps, actions)(Integrations));
