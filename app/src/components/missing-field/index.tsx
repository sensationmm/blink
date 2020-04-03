import React, { useState } from 'react';
import classNames from 'classnames';
import capitalize from '../../utils/functions/capitalize';

import FormInput, { FormInputProps } from '../form-input';
import Error from '../../svg/error.svg';
import Tooltip from '../tooltip';

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

    let errorMsg = [];

    if (props.missingSource !== 'Undefined') {
        errorMsg.push(<div>{capitalize(props.missingSource)}</div>);
    }
    if (props.missingCertification !== 'Undefined') {
        errorMsg.push(<div>{capitalize(props.missingCertification)}</div>);
    }

    return (
        <Styled.Main>
            {props.missingValue
                ? (!metaMissing ? <FormInput {...props} /> : <Styled.HasError><FormInput {...props} /></Styled.HasError>)
                : <div>
                    <FormStyled.FieldLabel>{props.label}</FormStyled.FieldLabel>
                    <FormStyled.MissingLabel>Meta data errors</FormStyled.MissingLabel>
                </div>
            }

            {metaMissing &&
                <Styled.Tooltip>
                    <Tooltip
                        style={'alert'}
                        alt={'Meta data error'}
                        message={errorMsg}
                        alignment={'right'}
                    />
                </Styled.Tooltip>
            }
        </Styled.Main>
    )
}

export default MissingField;
