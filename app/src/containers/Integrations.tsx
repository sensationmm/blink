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
import Box from '../layout/box';
import Blocks from '../layout/blocks';
import { Icon, AccountDetails, AccountName, AccountBalance, Item, TimeStamp, Refresh, LinkAccount } from "./integrations.styles";
import { blinkMarkets, currencySymbols } from '../utils/config/blink-markets';
import refreshIcon from '../svg/refresh_icon.svg'

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
  const [bankAccounts, setBankAccounts] = useState();
  const [counterparties, setCounterparties] = useState();
  const [transactions, setBankAccountTransactions] = useState();
  const filterAccountTypes = ["Any", "Bank", "Revenue", "DirectCosts", "Expense", "Current", "Inventory", "Fixed", "Currliab", "termLiab", "Equity"]

  const toggleAccountStatusAndRefreshData = async () => {
    const result = await props.xeroToggleAccountStatus(accountIdToToggleStatus, changeAccountStatusToArchived ? "ARCHIVED" : "ACTIVE");
    if (result.refresh) {
      onSelectTab(tabs.find((a: any) => a.name === "Accounts"))
    }
  }

  const getRevolutBankAccounts = async () => {
    const accounts = await props.revolutGetBankAccounts();
    setBankAccounts(accounts ?.map((account: any) => {
      if (account.accounts) {
        return {
          ...account, accounts: account.accounts ?.map((pot: any) => {
            return { ...pot, selectedCounterparty: "", pendingPaymentAmount: "" }
          }) 
        }
      }
    }))
  }

  const getRevolutCounterparties = async () => {
    const counterparties = await props.revolutGetCounterparties();
    setCounterparties(counterparties);
  }

  const getRevolutBankAccountTransactions = async () => {
    const transactions = await props.revolutGetBankAccountTransactions();
    // console.log(transactions)
    setBankAccountTransactions("transactions");
  }

  const updateSelectedAccountCounterparty = (accountId: string, potIndex: number, counterPartyId: string) => {
    setBankAccounts(bankAccounts ?.map((bankAccount: any) => {
      if (bankAccount.id === accountId) {
        bankAccount.accounts[potIndex].selectedCounterparty = counterPartyId
      }
      return bankAccount
    }));
  }

  const updatePotPendingPaymentAmount = (accountId: string, potIndex: number, paymentAmount: string) => {
    setBankAccounts(bankAccounts ?.map((bankAccount: any) => {
      if (bankAccount.id === accountId) {
        bankAccount.accounts[potIndex].pendingPaymentAmount = paymentAmount
      }

      return bankAccount
    }));
  }

  const refreshAccountDetails = async (accountId: string) => {
    const updatedAccount = await props.revolutGetBankAccount(accountId);
    setBankAccounts(bankAccounts ?.map((bankAccount: any) => {
      if (bankAccount.id === accountId) {
        return updatedAccount
      }
      return bankAccount
    }));
  }

  const makePaymentFromAccountPot = async (accountId: string, potIndex: number) => {

    const requestId = Math.random() * 10000000;
    const accountToPayFrom = bankAccounts ?.find((account: any) => account.id === accountId);
    let currencyToPayIn = accountToPayFrom.currency;

    const { selectedCounterparty, pendingPaymentAmount } = accountToPayFrom.accounts[potIndex];

    const counterPartySplit = selectedCounterparty.split(".");
    const counterPartyObject: any = {
      counterparty_id: counterPartySplit[0]
    }

    if (counterPartySplit[1]) {
      counterPartyObject.account_id = counterPartySplit[1];
    }

    if (counterPartySplit[2]) {
      currencyToPayIn = counterPartySplit[2];
    }

    const result = await props.revolutPostPayment(accountId, pendingPaymentAmount, currencyToPayIn, counterPartyObject, requestId);

    if (result.state) {
      getRevolutBankAccounts();
    }
  }

  const renderRevolut = () => {

    return <>

      {bankAccounts && <div style={{ marginBottom: 50 }}><ReactJson collapsed src={bankAccounts} /></div>}

      {bankAccounts && <Blocks>
        {bankAccounts ?.filter((account: any) => blinkMarkets.find(market => market.currency === account.currency))
        .map((account: any) => {
            const country = blinkMarkets.find(market => market.currency === account.currency);
            return account ?.accounts ?.map((pot: any, potIndex: number) => {

              if (potIndex > 0) {
                return false;
              }

              let currencyToPayIn = account.currency;
              if (pot.selectedCounterparty) {
                const selectedCounterpartySplit = pot.selectedCounterparty.split(".");
                if (selectedCounterpartySplit[2]) {
                  currencyToPayIn = selectedCounterpartySplit[2];
                }
              }

              return <Box key={`${account.id}-${pot.iban || pot.sort_code}`} title={''} icon={""} paddedLarge shadowed>
                {/* <Account> */}

                <TimeStamp>Updated: {new Date(account.updatedAt).toLocaleString('en-GB')}
                  <Refresh onClick={() => refreshAccountDetails(account.id)} src={refreshIcon} />
                </TimeStamp>

                <Icon><img src={country ?.flag} /></Icon>

                <AccountName>{account.name}</AccountName>

                <AccountDetails>
                  <AccountBalance>{(currencySymbols[account.currency] || account.currency)}{account.balance ?.toFixed(2)}</AccountBalance>
                  <Item>BLINK ACCOUNT </Item>
                  {pot.iban && <Item>IBAN: {pot.iban}</Item>}
                  {pot.bic && <>BIC: {pot.bic}</>}
                  {pot.account_no && <Item>Account no: {pot.account_no}</Item>}
                  {pot.sort_code && <>Sort code: {pot.sort_code}</>}
                </AccountDetails>

                {/*  
                <Item>BLINK ACCOUNT </Item>

                {
                  account.accounts?.map((pot: any) => <>
                    {pot.iban && <>IBAN: {pot.iban}</>}
                    {pot.account_no && <Item>Account no: {pot.account_no}</Item>}
                    {pot.sort_code && <>Sort code: {pot.sort_code}</>}
                  </>
                )}
                */}
                {counterparties && <div>
                  Make a payment to:  <select value={pot.selectedCounterparty} onChange={e => updateSelectedAccountCounterparty(account.id, potIndex, e.target.value)}>
                    <option value="" disabled>Please select</option>
                    {counterparties ?.map((counterparty: any) => {

                      if (counterparty.accounts && counterparty.accounts.length > 0) {
                        return counterparty.accounts.map((counterpartyAccount: any) => {
                          return <option key={counterpartyAccount.id} value={`${counterparty.id}.${counterpartyAccount.id}.${counterpartyAccount.currency}`}>{counterpartyAccount.name} ({counterpartyAccount.currency})</option>
                        });
                      }

                      return <option key={counterparty.id} value={counterparty.id}>{counterparty.name}</option>
                    }
                    )}
                  </select>

                  {pot.selectedCounterparty !== "" && <><span style={{ marginLeft: 10 }}>{(currencySymbols[currencyToPayIn] || currencyToPayIn)} </span>
                    <input style={{ width: 50, padding: 10, lineHeight: "10px" }} type="text" value={pot.pendingPaymentAmount} onChange={(e: any) => updatePotPendingPaymentAmount(account.id, potIndex, e.target.value)} /></>}

                  {pot.pendingPaymentAmount !== "" && !isNaN(parseFloat(pot.pendingPaymentAmount)) && parseFloat(pot.pendingPaymentAmount) > 0 && <button onClick={() => makePaymentFromAccountPot(account.id, potIndex)} style={{ fontSize: 12, marginLeft: 30 }}>Pay!</button>}

                </div>}

                {!pot.connections ?.xero && <LinkAccount onClick={async () => {
                  const result = await props.xeroConnectBankAccount(account.id,
                    account.currency,
                    pot,
                    account.name);

                  if (result.success) {
                    refreshAccountDetails(account.id)
                  }
                }}>Link</LinkAccount>}

              </Box>
            })
          })}

      </Blocks>}


    </>
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

  if (provider === undefined || provider === "revolut") {
    if (bankAccounts === undefined && counterparties === undefined && transactions === undefined) {
      // setBankAccounts([])
      getRevolutBankAccounts();
    }
    if (bankAccounts !== undefined && counterparties === undefined && transactions === undefined) {
      // setCounterparties([])
      getRevolutCounterparties();
    }
    if (bankAccounts !== undefined && counterparties !== undefined && transactions === undefined) {
      // setBankAccountTransactions([])
      getRevolutBankAccountTransactions();
    }
  }


  return <Styled.MainSt>
    <User />
    <Styled.Content>
      {(provider === undefined || provider === "xero")
        && renderXero()}
      {(provider === undefined || provider === "revolut")
        && renderRevolut()}
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
