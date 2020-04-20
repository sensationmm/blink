import styled from 'styled-components';

import { InputSt as MainInputSt } from '../styles';

export const Inputs = styled.div`
    display: flex;
    justify-content: center;
`;

export const InputSt = styled(MainInputSt)`
    width: 40px;
    margin-right: 20px;
    font-size: 40px;
    text-align: center;

    &:last-of-type {
        margin-right: 0;
    }
`;
