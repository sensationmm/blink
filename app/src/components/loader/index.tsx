import React from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
// import useLockBodyScroll from 'react-use/lib/useLockBodyScroll';

import * as Styled from './styles';

interface LoaderProps {
  manual?: boolean;
  loading: boolean;
  label: string;
}

const Loader: React.FC<LoaderProps> = ({ loading, label, manual = false }) => {
  // useLockBodyScroll(true);
  if (!loading && !manual) {
    return <div />;
  }

  return (
    <Styled.Loader data-test="component-loader" className={classNames({ manual: manual })}>
      <div className="lds-ripple">
        <div />
        <div />
      </div>
      <Styled.Label>{label}</Styled.Label>
    </Styled.Loader>
  );
};

const mapStateToProps = (state: any) => ({
  loading: state.loader.isLoading,
  label: state.loader.label
});

export default connect(mapStateToProps)(Loader);
