import React from 'react';
import capitalize from '../../utils/functions/capitalize';

import FormInput, { FormInputProps } from '../form-input';
import Tooltip from '../tooltip';
import FormLabel from '../form-label';

import * as Styled from './styles';
import * as FormStyled from '../form-input/styles';

interface MissingFieldProps extends FormInputProps {
    missingValue: boolean;
    missingSource: string;
    missingCertification: string;
    missingFile: string;
    missingValidation: string;
}

const MissingField: React.FC<MissingFieldProps> = (props) => {

    const metaMissing = props.missingSource !== 'Undefined' || props.missingCertification !== 'Undefined' || props.missingFile !== 'Undefined' || props.missingValidation !== 'Undefined';

    let errorMsg = [];

    if (props.missingSource !== 'Undefined') {
        errorMsg.push(<div key={'error-src'}>{capitalize(props.missingSource)}</div>);
    }
    if (props.missingCertification !== 'Undefined') {
        errorMsg.push(<div key={'error-cert'}>{capitalize(props.missingCertification)}</div>);
    }
    if (props.missingFile !== 'Undefined') {
        errorMsg.push(<div key={'error-file'}>{capitalize(props.missingFile)}</div>);
    }
    if (props.missingValidation !== 'Undefined') {
        errorMsg.push(<div key={'error-validation'}>{capitalize(props.missingValidation)}</div>);
    }

    return (
        <Styled.Main>
            {props.missingValue
                ? (!metaMissing ? <FormInput {...props} /> : <Styled.HasError><FormInput {...props} /></Styled.HasError>)
                : <div>
                    <FormLabel label={props.label} alignment={'left'} />
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
