import React, { useState } from 'react';

import Icon from '../icon';
import TickIcon from '../../svg/tick.svg';

import { InputSt } from '../styles';

import * as Styled from './styles';

export interface FormInputProps {
    stateKey: string;
    label: string;
    placeholder?: string;
    onChange: (key: string, val: string) => void
    onBlur?: (key: string, val: string) => void
    value: string;
    isEdit: boolean;
}

const FormInput: React.FC<FormInputProps> = ({ stateKey, label, placeholder, onChange, onBlur, value = '', isEdit = false }) => {
    const [focused, setFocused] = useState(false);
    const [initVal] = useState(value);

    const handleOnFocus = () => {
        onBlur && setFocused(true);
    }

    const handleOnBlur = (val: string) => {
        setFocused(false);
        onBlur && onBlur(stateKey, val)
    }

    let msg = placeholder;

    if (initVal) {
        msg += ` (found: ${initVal})`;
    }

    return (
        <Styled.Field>
            <Styled.FieldLabel>{label}</Styled.FieldLabel>
            <InputSt
                placeholder={msg}
                onChange={(e) => onChange(stateKey, e.target.value)}
                onFocus={handleOnFocus}
                onBlur={(e) => handleOnBlur(e.target.value)}
                type="text"
                value={initVal !== value || isEdit ? value : ''}
            />
            {focused && <Styled.Save onClick={() => handleOnBlur(value)}><Icon icon={TickIcon} size={'small'} style={'button'} /></Styled.Save>}
        </Styled.Field>
    )
}

export default FormInput;
