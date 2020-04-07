import React from 'react';
import classNames from 'classnames';

import Tooltip from '../../components/tooltip';

import * as Styled from './styles';

interface FormLabelProps {
    label: string;
    tooltip?: string;
    alignment?: 'left' | 'center';
    style?: 'normal' | 'bold';
}

const FormLabel: React.FC<FormLabelProps> = ({ label, tooltip, alignment = 'center', style = 'normal' }) => {
    return (
        <Styled.Main>
            {tooltip && <Tooltip message={tooltip} />}

            <Styled.Label className={classNames(alignment, style)}>{label}</Styled.Label>
        </Styled.Main>
    )
}

export default FormLabel;
