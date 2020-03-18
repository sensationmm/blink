import React, { useState } from 'react';
import classNames from 'classnames';
import capitalize from '../../utils/functions/capitalize';

import FormInput, { FormInputProps } from '../form-input';
import Error from '../../svg/error.svg';

import * as Styled from './styles';
import * as FormStyled from '../form-input/styles';

interface MissingFieldProps extends FormInputProps {
    missingValue: boolean;
    missingSource: string;
    missingCertification: string;
}

const MissingField: React.FC<MissingFieldProps> = (props) => {

    const metaMissing = props.missingSource !== 'Undefined' || props.missingCertification !== 'Undefined';
    const [showTooltip, setTooltip] = useState(false);

    return (
        <Styled.Main>
            {props.missingValue
                ? <FormInput {...props} />
                : <div>
                    <FormStyled.FieldLabel>{props.label}</FormStyled.FieldLabel>
                    <FormStyled.MissingLabel>Meta data errors</FormStyled.MissingLabel>
                </div>
            }

            {metaMissing &&
                <Styled.MissingIcon
                    src={Error}
                    alt={'Missing Source'}
                    onMouseEnter={() => setTooltip(true)}
                    onMouseLeave={() => setTooltip(false)}
                />
            }

            {metaMissing &&
                <Styled.Tooltip className={classNames({ active: showTooltip })}>
                    {props.missingSource !== 'Undefined' && <div>{capitalize(props.missingSource)}</div>}
                    {props.missingCertification !== 'Undefined' && <div>{capitalize(props.missingCertification)}</div>}
                </Styled.Tooltip>
            }
        </Styled.Main>
    )
}

export default MissingField;
