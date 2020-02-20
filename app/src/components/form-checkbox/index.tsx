import React from 'react';
import classNames from 'classnames';

import * as Styled from './styles';

interface FormCheckboxProps {
  label?: string;
  checked?: boolean;
  onChange?: Function;
  error?: string;
  disabled?: boolean;
}
const FormCheckbox: React.FC<FormCheckboxProps> = ({ label, checked = false, onChange, error, disabled = false }) => {
  return (
    <Styled.Main onClick={() => disabled || !onChange ? null : onChange(!checked)}>
      <Styled.Checkbox
        className={classNames(
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
