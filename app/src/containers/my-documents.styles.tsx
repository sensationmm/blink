import styled from 'styled-components';

import { Main as Actions } from '../layout/actions/styles';
import { Main as Icon } from '../components/icon/styles';

export const Entry = styled.div`
    cursor: pointer;
`;

export const Progress = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;

    > div {
        width: 0;
        flex-grow: 1;
        display: flex;
        text-align: center;
        justify-content: center;

        &:first-child {
            text-align: left;
            justify-content: flex-start;
        }

        &:last-child {
            text-align: right;
            justify-content: flex-end;
        }
    }
`;

export const Bubble = styled.div`
    width: 60px;
    height: 60px;
    border-radius: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--basic-shadow-light);

    &.complete {
        background: var(--brand-primary);
    }
`;

export const Header = styled.div`
    display: flex;
    align-items: center;

    > div {
        margin-right: 20px;
    }
`;

export const HeaderName = styled.div`
    font-size: 1.4em;
    margin-bottom: 10px;
`;

export const HeaderRole = styled.div`
    font-size: 0.8em;
    color: var(--basic-shadow);
`;

export const TaxBlock = styled.div`
    display: flex;
    justify-content: space-between;
    width: auto;

    > div {
        width: 0;
        flex-grow: 1;

        &:first-child {
            margin-right: 20px;
        }
    }
`;

export const Inputs = styled.div`
    text-align: left;

    label {
        text-align: left;
        font-size: 0.8em;
        color: var(--basic-shadow);
    }
`;

export const ManualApproval = styled(Inputs)`
    width: 500px;

    ${Actions} {
        padding-top: 0;
    }
`;

export const Mask = styled.div`
    font-size: 1.4em;
`;

export const Intro = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;

    ${Icon} {
        margin-bottom: 20px;
    }
`;
