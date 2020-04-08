import React, { useState } from 'react';
import Box from '../../layout/box';
import Blocks from '../../layout/blocks';
import { Icon, AccountDetails, AccountName, AccountBalance, Item, TimeStamp, Refresh, LinkAccount } from "./styles";
import { blinkMarkets, currencySymbols } from '../../utils/config/blink-markets';
import refreshIcon from '../../svg/refresh_icon.svg'

const Revolut = (props: any) => {

    const [bankAccounts, setBankAccounts] = useState();
    const [counterparties, setCounterparties] = useState();
    const [transactions, setBankAccountTransactions] = useState();


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
        setBankAccounts(bankAccounts.map && bankAccounts ?.map((bankAccount: any) => {
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


    return <>

        {/* {bankAccounts && <div style={{ marginBottom: 50 }}><ReactJson collapsed src={bankAccounts} /></div>} */}
        <h1 style={{ marginTop: 50 }}>Accounts</h1>
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
                            {
                                // false && 
                                counterparties && <div>
                                Make a payment to:  <select value={pot.selectedCounterparty} onChange={e => updateSelectedAccountCounterparty(account.id, potIndex, e.target.value)}>
                                    <option value="" disabled>Please select</option>
                                    {counterparties.map && counterparties ?.map((counterparty: any) => {

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

        {!bankAccounts && <></>}
    </>

};

export default Revolut;
