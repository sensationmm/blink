import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { xeroDisconnect } from '../redux/actions/integrations';
import { xeroAuthenticate } from '../utils/integrations/request';
import * as Styled from './modal-styles';
import Button from "../components/button";

const renderXero = (xeroIntegration: object, uId: string, xeroDisconnect: (uId: string) => void) => <Styled.Actions> 
{xeroIntegration && <Button onClick={() => xeroDisconnect(uId)} label="Disconnect Xero"></Button>}
{!xeroIntegration && <Button onClick={() => xeroAuthenticate(uId)} label="Connect Xero"></Button>}
</Styled.Actions>

const Integrations = (props: any) => {
  const provider = props.match.params.provider;
  return <>
    {(provider === undefined || provider === "xero") && renderXero(props.auth.user?.xero, props.auth.user?.localId, props.xeroDisconnect)}
  </>
};

const mapStateToProps = (state: any) => ({
  auth: state.auth,
});

const actions = {
  xeroDisconnect
};

export default withRouter(connect(mapStateToProps, actions)(Integrations));
