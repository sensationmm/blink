import React, { useState } from 'react';
import classNames from 'classnames';

import Icon from '../icon';
import TickIcon from '../../svg/tick.svg';
import FormLabel from '../form-label';

import { InputSt } from '../styles';

import * as Styled from './styles';

export interface FormInputProps {
    type?: 'text' | 'number' | 'password';
    stateKey: string;
    label: string;
    placeholder?: string;
    onChange: (key: string, val: string) => void
    onBlur?: (key: string, val: string) => void
    value: string;
    isEdit?: boolean;
    suffix?: string;
    validated?: boolean;
    disabled?: boolean;
    hasError?: boolean;
}

const FormInput: React.FC<FormInputProps> = ({
    type = 'text',
    stateKey,
    label,
    placeholder,
    onChange,
    onBlur,
    value = '',
    isEdit = false,
    suffix,
    validated = false,
    disabled = false,
    hasError = false
}) => {
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

    if (initVal && !isEdit) {
        msg += ` (found: ${initVal})`;
    }

    return (
        <Styled.Field>
            <FormLabel label={label} alignment={'left'} />

            <Styled.FieldHolder>
                <InputSt
                    className={classNames({ edit: isEdit }, { disabled: disabled }, { error: hasError })}
                    placeholder={msg}
                    onChange={(e) => onChange(stateKey, e.target.value)}
                    onFocus={handleOnFocus}
                    onBlur={(e) => handleOnBlur(e.target.value)}
                    type={type}
                    value={initVal !== value || isEdit ? (value || '') : ''}
                    disabled={disabled}
                />
                {(focused || suffix !== '' || validated) &&
                    <Styled.After>
                        {focused &&
                            <Styled.Save onClick={() => handleOnBlur(value)}><Icon icon={TickIcon} size={'small'} style={'button'} /></Styled.Save>
                        }

                        {suffix !== '' &&
                            <Styled.Suffix>{suffix}</Styled.Suffix>
                        }

                        {validated && <Styled.Valid />}
                    </Styled.After>
                }
            </Styled.FieldHolder>
        </Styled.Field>
    )
}

export default FormInput;
