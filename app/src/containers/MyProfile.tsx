import React from 'react';
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';
import classNames from 'classnames';
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
import { xeroAuthenticate, xeroGetInvoices } from '../utils/integrations/request';
import { userSignout } from '../redux/actions/auth';

import * as Styled from '../components/styles';
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
import dashboardImg from '../svg/screens/dashboard.jpg';

import Screen from '../components/screen';
import Revolut from "../components/integrations/revolut";

import settings1a from '../svg/screens/settings1a.jpg';
import settings1b from '../svg/screens/settings1b.jpg';
import settings2 from '../svg/screens/settings2.jpg';
import settings3 from '../svg/screens/settings3.jpg';
import settings4 from '../svg/screens/settings4.jpg';
import settings5 from '../svg/screens/settings5.jpg';
import tax1a from '../svg/screens/tax1a.jpg';
import tax1b from '../svg/screens/tax1b.jpg';
import tax2 from '../svg/screens/tax2.jpg';
import tax3 from '../svg/screens/tax3.jpg';
import funding1 from '../svg/screens/funding1.jpg';
import funding2 from '../svg/screens/funding2.jpg';
import stripe from '../svg/screens/stripe.jpg';
import developer from '../svg/screens/developer.jpg';
import accounts1 from '../svg/screens/accounts1.jpg';
import accounts2 from '../svg/screens/accounts2.jpg';
import accounts3 from '../svg/screens/accounts3.jpg';
import accounts4 from '../svg/screens/accounts4.jpg';
import accounts5 from '../svg/screens/accounts5.jpg';
import accounts6 from '../svg/screens/accounts6.jpg';
import accounts7 from '../svg/screens/accounts7.jpg';
import accounts8 from '../svg/screens/accounts8.jpg';
import connectbanks1 from '../svg/screens/connectbanks1.jpg';
import connectbanks2 from '../svg/screens/connectbanks2.jpg';
import connectbanks3 from '../svg/screens/connectbanks3.jpg';
import connectbanks4 from '../svg/screens/connectbanks4.jpg';
import connectbanks5 from '../svg/screens/connectbanks5.jpg';
import connectbanks6 from '../svg/screens/connectbanks6.jpg';
import connectbanks7 from '../svg/screens/connectbanks7.jpg';


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

  &.disabled {
    opacity: 0.2;
    cursor: not-allowed;
    pointer-events: none;
  }
`

// const Screen = styled.div`
//   background-size: contain;
//   height: 500px;
//   background-repeat: no-repeat;
//   background-position: 0;
// `

const Integration = (props: any) =>
  <Box hoverStyling={!props.disabled} title={''} shadowed >
    <IntegrationInner className={classNames({ disabled: props.disabled })}>
      {props.children}
    </IntegrationInner>
  </Box>

const MyProfile = (props: any) => {

  const integrations = [
    {
      label: "accountancy",
      integrations: [
        { name: "Xero", logo: xeroLogo, path: "xero" },
        { name: "Flux", logo: fluxLogo, path: "" },
        { name: "Sage", logo: sageLogo, path: "" }
      ]
    },
    {
      label: "collections",
      integrations: [
        { name: "Stripe", logo: stripeLogo, path: "integrations/stripe" },
        { name: "Adyen", logo: adyenLogo, path: "" },
        { name: "Square", logo: squareLogo, path: "" },
      ]
    },
    {
      label: "developer integrations",
      integrations: [
        { name: "Blink", logo: blinkLogo, path: "integrations/developer" }
      ]
    }
  ]

  const provider = props.match.params.provider;
  const section = props.match.params.section;

  return <>
    {
      // false && 
      <Styled.Header>
        <img alt="Blink" src={blinkLogo} />
      </Styled.Header>}
    <Styled.MainStScreens>

      {
        (provider === "xero" ||
          provider === "accounts" ||
          provider === "tax" ||
          provider === "local-tax-partners" ||
          provider === "tax-planning" ||
          provider === "settings" ||
          provider === "funding" ||
          provider === undefined) &&
        <Menu path={provider} section={section} userSignout={props.userSignout} userName={props?.auth?.user.name || props?.auth?.user.email} />
      }

      {(provider === undefined) &&
        <>
          <MainStyled.ContentNarrow>
            <img src={dashboardImg} />
          </MainStyled.ContentNarrow>
        </>
      }

      {(provider === "xero") &&
        <>
          <MainStyled.ContentNarrow>
            <Xero
              xeroAuthenticate={xeroAuthenticate}
              xeroGetInvoices={xeroGetInvoices}
              xeroDisconnect={props.xeroDisconnect}
              xeroConnectBankAccount={props.xeroConnectBankAccount}
              xeroGetBankAccounts={props.xeroGetBankAccounts}
              xeroToggleAccountStatus={props.xeroToggleAccountStatus}
              xeroDeleteBankAccount={props.xeroDeleteBankAccount}
              auth={props.auth} />
          </MainStyled.ContentNarrow>
        </>
      }

      {(provider === "integration-demo") &&
        <>
          <MainStyled.ContentNarrow>
            <Revolut
              revolutGetBankAccounts={props.revolutGetBankAccounts}
              xeroConnectBankAccount={props.xeroConnectBankAccount}
              revolutGetBankAccount={props.revolutGetBankAccount}
              revolutGetCounterparties={props.revolutGetCounterparties}
              revolutGetBankAccountTransactions={props.revolutGetBankAccountTransactions}
              revolutPostPayment={props.revolutPostPayment} />
          </MainStyled.ContentNarrow>
        </>
      }

      {(provider === "accounts") &&
        <>
          <MainStyled.ContentNarrow>
            {section === undefined &&
              <Screen steps={[accounts1, accounts2]}></Screen>
            }
            {section === 'make-a-payment' && <><h1>Make a payment</h1><Screen steps={[accounts3, accounts4, accounts5, accounts6, accounts7, accounts8]}></Screen></>}
            {section === 'connect-banks' && <Screen steps={[connectbanks1, connectbanks2, connectbanks3, connectbanks4, connectbanks5, connectbanks6, connectbanks7]}></Screen>}
          </MainStyled.ContentNarrow>
        </>
      }


      {(provider === "tax") &&
        <>
          <MainStyled.ContentNarrow>
            {section === undefined &&
              <div>
                <table cellPadding="0" cellSpacing="0">
                  <tr>
                    <td><img onClick={() => props.history.push('/my-profile/tax/tax-planning')} src={tax1a} /></td>
                    <td><img onClick={() => props.history.push('/my-profile/tax/local-tax-partners')} src={tax1b} /></td>
                  </tr>
                </table>
              </div>
            }
            {section === 'tax-planning' && <img src={tax2} />}
            {section === 'local-tax-partners' && <img src={tax3} />}
          </MainStyled.ContentNarrow>
        </>
      }
      {(provider === "tax-planning") &&
        <>
          <MainStyled.ContentNarrow>
            <h2>Tax planning</h2>
            <p>Some of the most important dates for your tax calendar</p>
            {/* <Screen style={{ height: 350, backgroundImage: `url(${taxPlanningImg})` }} /> */}
          </MainStyled.ContentNarrow>
        </>
      }
      {(provider === "local-tax-partners") &&
        <>
          <MainStyled.ContentNarrow>
            <h2>We recommend these tax experts based on your business needs </h2>
            {/* <Screen style={{ backgroundImage: `url(${taxPartnersImg})` }} /> */}
          </MainStyled.ContentNarrow>
        </>
      }

      {(provider === "settings") &&
        <>
          <MainStyled.ContentNarrow>
            <h1>Settings </h1>
            {section === undefined &&
              <div>
                <table cellPadding="0" cellSpacing="0">
                  <tr>
                    <td><img onClick={() => props.history.push('/my-profile/settings/general')} src={settings1a} /></td>
                    <td><img onClick={() => props.history.push('/my-profile/settings/users')} src={settings1b} /></td>
                  </tr>
                </table>
              </div>
            }
            {section === 'users' && <Screen steps={[settings2, settings3, settings4, settings5]}></Screen>}
          </MainStyled.ContentNarrow>
        </>
      }

      {(provider === "funding") &&
        <>
          <MainStyled.ContentNarrow>
            <Screen steps={[funding1, funding2]}></Screen>
          </MainStyled.ContentNarrow>
        </>
      }



      {(provider === "integrations") && <>
        <Menu path="integrations" userSignout={props.userSignout} userName={props?.auth?.user.name || props?.auth?.user.email} />

        <MainStyled.ContentNarrow>
          <h1>Integrations</h1>
          {section === undefined && <>
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
                              <Link title={integration.name} to={`/my-profile/${integration.path}`}>
                                <img alt={integration.name} src={integration.logo} />
                              </Link>
                            ),
                            disabled: integration.path === ''
                          };
                        })
                    }
                  />
                </div>)
              }
            </div>
          </>
          }
          {section === 'stripe' && <><h2>Stripe</h2><img src={stripe} /></>}
          {section === 'developer' && <><h2>Developer</h2><img src={developer} /></>}
        </MainStyled.ContentNarrow>
      </>}


    </Styled.MainStScreens>

  </>
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

export default withRouter(connect(mapStateToProps, actions)(withRouter(MyProfile)));
