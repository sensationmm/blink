import React from 'react';
import { connect } from 'react-redux';
import { clearModal } from '../redux/actions/modal';
import * as Styled from './modal-styles';
import Button from "../components/button";

const Modal = (props: any) => {
  if (!props.modal) {
    return <div></div>;
  }

  return (
    <Styled.Modal>
      <Styled.Message>
      <Styled.Heading>{props.modal.heading}</Styled.Heading>
      {props.modal.message}
      <Styled.Actions>
        <Button onClick={() => {
          props.clearModal();
          if (typeof props.modal.onClose === "function") {
            props.modal.onClose();
          }
        }} label="Ok - Thanks"></Button>
      </Styled.Actions>
      </Styled.Message>
    </Styled.Modal>
  );
};

const mapStateToProps = (state: any) => ({
  modal: state.modal,
});

const actions = {
  clearModal
}

export default connect(mapStateToProps, actions)(Modal);
