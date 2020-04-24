import React from 'react';
import classNames from 'classnames';

import * as Styled from './styles';

interface FormCheckboxProps {
  label?: string;
  checked?: boolean;
  onChange?: Function;
  error?: string;
  disabled?: boolean;
  style?: 'tick' | 'confirm' | 'group';
}
const FormCheckbox: React.FC<FormCheckboxProps> = ({ label, checked = false, onChange, error, disabled = false, style = 'tick' }) => {
  return (
    <Styled.Main onClick={() => disabled || !onChange ? null : onChange(label, !checked)}>
      <Styled.Checkbox
        className={classNames(
          style,
          { 'checked': checked },
          { 'error': error },
          { 'disabled': disabled }
        )}
      />

      {label && <div className="checkbox-label">{label}</div>}
    </Styled.Main>
  );
};

export default FormCheckbox;
