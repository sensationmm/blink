import React from 'react';

import getByValue from '../../utils/functions/getByValue';

import * as Styled from './styles';

interface FormSelectProps {
    stateKey: string;
    label: string;
    onChange: (value: string, label: string) => void
    options: any;
    value: string;
}

const FormSelect: React.FC<FormSelectProps> = ({
    stateKey,
    label,
    onChange,
    options,
    value,
}) => {

    const selectedIcon = getByValue(options, 'value', value).icon;

    console.log(typeof selectedIcon)

    return (
        <Styled.Main>
            <Styled.Label>{label}</Styled.Label>

            <Styled.Field>
                {selectedIcon &&
                    <Styled.Icon>
                        {typeof selectedIcon === 'object' ? selectedIcon : <img src={selectedIcon} />}
                    </Styled.Icon>
                }

                <select
                    value={value}
                    onChange={(e) => onChange(stateKey, e.target.value)}
                >
                    {options.map((option: any, count: number) => {
                        return (
                            <option value={option.value} key={`option-${count}`} selected={option.value === value}>
                                {option.label}
                            </option>
                        )
                    })}
                </select>
            </Styled.Field>
        </Styled.Main>
    );
};

export default FormSelect;

