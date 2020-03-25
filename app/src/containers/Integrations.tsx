import React, { useState } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { xeroDisconnect } from '../redux/actions/integrations';
import { xeroAuthenticate, xeroGetBankAccounts, xeroGetInvoices } from '../utils/integrations/request';
import { Actions } from './modal-styles';
import ReactJson from "react-json-view";
import * as Styled from '../components/styles';
import Button from "../components/button";


const Integrations = (props: any) => {

  const initialTabs: any = [
    { name: "Invoices", method: xeroGetInvoices },
    {
      name: "Accounts", method: xeroGetBankAccounts
    }]
  const [activeTab, setActiveTab] = useState();
  const [tabs, setTabs] = useState(initialTabs)

  const renderXero = () => {
    const xeroIntegration = props.auth.user ?.xero;
    const uId = props.auth.user ?.localId;
    return <>
      <Styled.Tabs>
        {tabs.map((tab: any) => <li key={tab.name} className={activeTab ?.name === tab.name ? "active" : ""}><a onClick={() => onSelectTab(tab)}>{tab.name}</a></li>
        )}
      </Styled.Tabs>
      <>
        {activeTab ?.data && <>
          <ReactJson collapsed src={activeTab ?.data} />
        </>}
      </>
      <Actions>
        {xeroIntegration && <Button onClick={() => xeroDisconnect(uId)} label="Disconnect Xero"></Button>}
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

  if (activeTab === undefined) {
    onSelectTab(tabs[0]);
  }

  const provider = props.match.params.provider;
  return <Styled.MainSt>
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
  xeroGetBankAccounts
};

export default withRouter(connect(mapStateToProps, actions)(Integrations));
