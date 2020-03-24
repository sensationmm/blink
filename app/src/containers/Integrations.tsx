import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
// import { clearModal } from '../redux/actions/modal';
import { xeroAuthenticate, xeroDisconnect } from '../utils/integrations/request';
import * as Styled from './modal-styles';
import Button from "../components/button";

const renderXero = (xeroIntegration: object, uId: string) => <Styled.Actions> 
{xeroIntegration && <Button onClick={() => xeroDisconnect(uId)} label="Disconnect Xero"></Button>}
{!xeroIntegration && <Button onClick={() => xeroAuthenticate(uId)} label="Connect Xero"></Button>}
</Styled.Actions>

const Integrations = (props: any) => {
  const provider = props.match.params.provider;
  return <>
    {(provider === undefined || provider === "xero") && renderXero(props.auth.user?.xero, props.auth.user?.localId)}
  </>
};

const mapStateToProps = (state: any) => ({
  auth: state.auth,
});

const actions = {};

export default withRouter(connect(mapStateToProps, actions)(Integrations));
