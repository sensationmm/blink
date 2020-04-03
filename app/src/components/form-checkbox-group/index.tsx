import React, { useState } from 'react';

import Checkbox from '../form-checkbox';

import * as Styled from './styles';

interface OptionProps {
    label: string;
    value: any;
}

interface FormCheckboxGroupProps {
    options: OptionProps[];
    selected?: number | null;
    onChange?: (value: any) => void;
}

const FormCheckboxGroup: React.FC<FormCheckboxGroupProps> = ({ options, selected, onChange }) => {
    const [selectedOption, setSelectedOption] = useState(selected);

    return (
        <Styled.Main>
            {options.map((option: any, count: number) => {
                return <Checkbox
                    key={`option-${count}`}
                    style={'group'}
                    label={option.label}
                    onChange={() => { setSelectedOption(count); onChange && onChange(options[count].value); }}
                    checked={selectedOption === count}
                />
            })}
        </Styled.Main>
    )
}

export default FormCheckboxGroup;
