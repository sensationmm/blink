import React, { useState } from 'react';

import Button from '../button';
import Actions from '../../layout/actions';

import * as Styled from './styles';

interface VerifyCodeProps {
    onSubmit: (value: string) => void;
}

const VerifyCode: React.FC<VerifyCodeProps> = ({ onSubmit }) => {
    const [code, setCode] = useState('');

    const onType = (index: number, value: string) => {
        const newValue = code.substr(0, index) + value + code.substr(index + 1);

        setCode(newValue);

        document.getElementById(`input${index + 1}`)?.focus();
    }

    return (
        <div>
            <Styled.Inputs>
                <Styled.InputSt id={'input0'} value={code.substr(0, 1)} onChange={(e) => onType(0, e.target.value)} />
                <Styled.InputSt id={'input1'} value={code.substr(1, 1)} onChange={(e) => onType(1, e.target.value)} />
                <Styled.InputSt id={'input2'} value={code.substr(2, 1)} onChange={(e) => onType(2, e.target.value)} />
                <Styled.InputSt id={'input3'} value={code.substr(3, 1)} onChange={(e) => onType(3, e.target.value)} />
                <Styled.InputSt id={'input4'} value={code.substr(4, 1)} onChange={(e) => onType(4, e.target.value)} />
                <Styled.InputSt id={'input5'} value={code.substr(5, 1)} onChange={(e) => onType(5, e.target.value)} />
            </Styled.Inputs>

            <Actions centered>
                <Button onClick={() => onSubmit(code)} small />
            </Actions>
        </div>
    )
}

export default VerifyCode;
