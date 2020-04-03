import React from 'react';

import Tooltip from '../../components/tooltip';

import * as Styled from './styles';

interface FormLabelProps {
    label: string;
    tooltip?: string;
}

const FormLabel: React.FC<FormLabelProps> = ({ label, tooltip }) => {
    return (
        <Styled.Main>
            {tooltip && <Tooltip message={tooltip} />}

            <Styled.Label>{label}</Styled.Label>
        </Styled.Main>
    )
}

export default FormLabel;
