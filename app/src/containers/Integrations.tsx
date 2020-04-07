import React from 'react';
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';
import {
  xeroDisconnect,
  xeroDeleteBankAccount,
  xeroConnectBankAccount,
  xeroToggleAccountStatus,
  xeroGetBankAccounts,
  revolutGetBankAccount,
  revolutGetBankAccounts,
  revolutGetBankAccountTransactions,
  revolutGetCounterparties,
  revolutPostPayment
} from '../redux/actions/integrations';
import { userSignout } from '../redux/actions/auth';

import * as Styled from '../components/styles';
import Revolut from "../components/integrations/revolut";
import Xero from "../components/integrations/xero";
import Menu from "../components/integrations/menu";
import FlexRowGrid from '../layout/flex-row-grid';
import Box from '../layout/box'
import * as MainStyled from "../components/styles";
import xeroLogo from '../svg/xero-logo.svg';
import fluxLogo from '../svg/flux-logo.svg';
import sageLogo from '../svg/sage-logo.svg';
import stripeLogo from '../svg/stripe-logo.svg';
import adyenLogo from '../svg/adyen-logo.svg';
import squareLogo from '../svg/square-logo.svg';
import blinkLogo from '../svg/blink-logo.svg';

import styled from "styled-components";

const Label = styled.label`
  width: 100%;
  padding: 40px 0 20px 0;
  display: block;
  font-size: 14px;
  text-transform: uppercase
`
const IntegrationInner = styled.div`
  height: 150px;

  a {
    display: block;
    height: calc(100% + 40px);
    width: calc(100% + 40px);
    display: flex;
    justify-content: center;
    margin: -20px;
  }
  img {
    width: 80px;
  }
`


const Integration = (props: any) =>
  <Box title={''} shadowed>
    <IntegrationInner>
      {props.children}
    </IntegrationInner>
  </Box>

const Integrations = (props: any) => {

  const integrations = [
    {
      label: "accountancy",
      integrations: [
        { name: "xero", logo: xeroLogo, path: "xero" },
        { name: "flux", logo: fluxLogo, path: "" },
        { name: "sage", logo: sageLogo, path: "" }
      ]
    },
    {
      label: "collections",
      integrations: [
        { name: "stripe", logo: stripeLogo, path: "" },
        { name: "adyen", logo: adyenLogo, path: "" },
        { name: "square", logo: squareLogo, path: "" },
      ]
    },
    {
      label: "developer integrations",
      integrations: [
        { name: "blink", logo: blinkLogo, path: "" }
      ]
    }
  ]

  const provider = props.match.params.provider;

  return <Styled.MainSt>
    {(provider === "xero") &&
      <>
        <Menu path="integrations" userSignout={props.userSignout} userName={props ?.auth ?.user.displayName || props ?.auth ?.user.email} />

        <MainStyled.ContentNarrow>
          <Xero
            xeroDisconnect={props.xeroDisconnect}
            xeroConnectBankAccount={props.xeroConnectBankAccount}
            xeroGetBankAccounts={props.xeroGetBankAccounts}
            xeroToggleAccountStatus={props.xeroToggleAccountStatus}
            xeroDeleteBankAccount={props.xeroDeleteBankAccount}
            auth={props.auth} />
        </MainStyled.ContentNarrow>
      </>
    }
    {(provider === "accounts") &&
      <>
        <Menu path="accounts" userSignout={props.userSignout} userName={props ?.auth ?.user.displayName || props ?.auth ?.user.email} />

        <MainStyled.ContentNarrow>
          <Revolut
            revolutGetBankAccounts={props.revolutGetBankAccounts}
            revolutGetBankAccount={props.revolutGetBankAccount}
            revolutGetCounterparties={props.revolutGetCounterparties}
            revolutGetBankAccountTransactions={props.revolutGetBankAccountTransactions}
            revolutPostPayment={props.revolutPostPayment} />
        </MainStyled.ContentNarrow>
      </>
    }


    {(provider === undefined) && <>
      <Menu path="integrations" userSignout={props.userSignout} userName={props ?.auth ?.user.displayName || props ?.auth ?.user.email} />

      <MainStyled.ContentNarrow>
        <h1 style={{ marginTop: 50 }}>Integrations</h1>

        Integrate with apps you already use in just a click or build custom integrations according to your business needs.
        <div style={{ maxWidth: 700 }}>

          {
            integrations.map((group: any) => <div key={group.label}>
              <Label>{group.label}</Label>
              <FlexRowGrid
                component={Integration}
                cols={3}
                content={
                  group.integrations
                    .map((integration: any) => {
                      return {
                        children: (
                          <Link to={`/integrations/${integration.path}`}>
                            <img src={integration.logo} />
                          </Link>
                        )
                      };
                    })
                }
              />
            </div>)
          }
        </div>
      </MainStyled.ContentNarrow>
    </>}


  </Styled.MainSt >
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
  revolutGetCounterparties,
  revolutGetBankAccountTransactions,
  revolutPostPayment,
  userSignout
};

export default withRouter(connect(mapStateToProps, actions)(Integrations));
