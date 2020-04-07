import styled from 'styled-components';

export const Main = styled.div`
    position: relative;
    width: 50px;
    height: 50px;
    border-radius: 26px;
    border: 2px solid #000;
    background: center center no-repeat;
    background-size: contain;
    flex-shrink: 0;

    &.large {
        width: 100px;
        height: 100px;
        border-radius: 50px;
    }

    &.small {
        width: 30px;
        height: 30px;
        border-radius: 15px;
        background-position: center top 5px;
    }

    &.company {
        background-color: var(--brand-company);
    }

    &.person {
        background-color: var(--brand-person);
    }

    &.button {
        border: 0;
        background: var(--brand-primary) center center no-repeat;
        background-size: 60%;
    }
`;

export const Sub = styled.div`
    position: absolute;
    top: -8px;
    right: -8px;
    width: 20px;
    height: 20px;
    border-radius: 26px;
    border: 1px solid #000;
    background: var(--brand-warning) center center no-repeat;
    background-size: contain;
`;
