import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames'

import * as Styled from './styles';

const Button = props => {
  const {
    label,
    onClick,
    disabled,
    fullWidth,
    hidden,
    icon,
  } = props;

  return (
    <Styled.Button
      data-test='component-button'
      disabled={disabled}
      style={{ display: hidden ? 'none' : 'block' }}
      className={classNames(
        { 'full': fullWidth },
        { 'disabled': disabled },
      )}
      onClick={onClick}
    >
      {label}
      {icon &&
        <img className="button-icon" alt="" src={icon} />
      }
    </Styled.Button>
  );
};

Button.propTypes = {
  label: PropTypes.string,
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
  fullWidth: PropTypes.bool,
};

Button.defaultProps = {
  label: 'Submit',
  disabled: false,
  fullWidth: false,
};

export default Button;
