import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames'

import * as Styled from './styles';

interface ButtonProps {
  label?: string;
  onClick: () => void;
  disabled?: boolean;
  fullWidth?: boolean;
  hidden?: boolean;
  icon?: string;
  type?: 'primary' | 'secondary';
}

const Button: React.FC<ButtonProps> = ({
  label = 'Submit',
  onClick,
  disabled = false,
  fullWidth = false,
  hidden = false,
  icon,
  type = 'primary'
}) => {
  return (
    <Styled.Button
      data-test='component-button'
      disabled={disabled}
      className={classNames(
        type,
        { 'full': fullWidth },
        { 'disabled': disabled },
        { 'hidden': hidden }
      )}
      onClick={onClick}
    >
      <span>{label}</span>
      {icon &&
        <img className="button-icon" alt="" src={icon} />
      }
    </Styled.Button>
  );
};

export default Button;
