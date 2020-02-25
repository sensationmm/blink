import React from 'react';
import { connect } from 'react-redux';
// import useLockBodyScroll from 'react-use/lib/useLockBodyScroll';

import * as Styled from './styles';

const Loader = (props: any) => {
  // useLockBodyScroll(true);
  if (!props.loading) {
    return <div />;
  }

  return (
    <Styled.Loader data-test="component-loader">
      <div className="lds-ripple">
        <div />
        <div />
      </div>
      <Styled.Label>{props.label}</Styled.Label>
    </Styled.Loader>
  );
};

const mapStateToProps = (state: any) => ({
  loading: state.loader.isLoading,
  label: state.loader.label
});

export default connect(mapStateToProps)(Loader);
