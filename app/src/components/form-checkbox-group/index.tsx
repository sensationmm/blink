import React, { useState } from 'react';

import Checkbox from '../form-checkbox';

import * as Styled from './styles';

interface OptionProps {
    label: string;
    value: any;
}

interface FormCheckboxGroupProps {
    stateKey: string;
    options: OptionProps[];
    selected?: any;
    onChange?: (key: string, val: string) => void
}

const FormCheckboxGroup: React.FC<FormCheckboxGroupProps> = ({ stateKey, options, selected, onChange }) => {
    const [selectedOption, setSelectedOption] = useState(selected);

    return (
        <Styled.Main>
            {options.map((option: any, count: number) => {
                return <Checkbox
                    key={`option-${count}`}
                    style={'group'}
                    label={option.label}
                    onChange={() => { setSelectedOption(options[count].value); onChange && onChange(stateKey, options[count].value); }}
                    checked={selectedOption === options[count].value}
                />
            })}
        </Styled.Main>
    )
}

export default FormCheckboxGroup;
