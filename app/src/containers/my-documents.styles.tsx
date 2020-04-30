import styled from 'styled-components';

import { Main as Actions } from '../layout/actions/styles';
import { Main as Icon } from '../components/icon/styles';

import IconTick from '../svg/tick.svg';

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
            width: 50%;
            flex-grow: 0;
        }

        &:last-child {
            text-align: right;
            justify-content: flex-end;
        }
    }
`;

export const Header = styled.div`
    display: flex;
    align-items: center;

    > div {
        margin-right: 30px;
    }
`;

export const HeaderName = styled.div`
    font-size: 1.4em;
`;

export const HeaderRole = styled.div`
    font-size: 0.8em;
    color: var(--basic-shadow);
    text-transform: uppercase;
    font-weight: bold;
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
    width: 100%;
    max-width: 460px;
    text-align: left;
    margin: 0 auto;

    label, input[type="text"] {
        text-align: center;
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

export const SubHeading = styled.h2`
    color: var(--basic-shadow);
`;

export const Status = styled.div`
    color: var(--basic-shadow);
`;

export const StatusComplete = styled.div`
    display: flex;
    color: var(--basic-text);

    &:after {
        content: '';
        width: 20px;
        height: 20px;
        display: inline-block;
        margin-left: 10px;
        background: var(--brand-primary);
        mask: url(${IconTick}) center right no-repeat;
        mask-size: contain;
    }
`;

export const Terms = styled.div`
    border: 1px solid var(--basic-shadow);
    background: var(--basic-white);
    padding: 60px 150px;
`;

export const TermsLink = styled.span`
    color: var(--brand-secondary);
    cursor: pointer;
    padding: 0 5px;

    &:hover {
        text-decoration: underline;
    }
`;

export const TermsAccept = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
`;
