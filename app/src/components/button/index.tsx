import React from 'react';
import classNames from 'classnames'

import * as Styled from './styles';

interface ButtonProps {
  label?: string;
  onClick: (e: any) => void;
  disabled?: boolean;
  fullWidth?: boolean;
  hidden?: boolean;
  small?: boolean;
  icon?: string;
  type?: 'primary' | 'secondary' | 'tertiary';
}

const Button: React.FC<ButtonProps> = ({
  label = 'Submit',
  onClick,
  disabled = false,
  fullWidth = false,
  hidden = false,
  small = false,
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
        { 'hidden': hidden },
        { 'small': small }
      )}
      onClick={(e) => { e.stopPropagation(); onClick(e); }}
    >
      <span>{label}</span>
      {icon &&
        <img className="button-icon" alt="" src={icon} />
      }
    </Styled.Button>
  );
};

export default Button;
