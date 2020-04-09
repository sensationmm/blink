import styled, { keyframes } from 'styled-components';

import { Main as Icon } from '../icon/styles';

const zoomIn = keyframes`
    0% {
        opacity: 0;
        transform: scale(0) rotate(180deg);
    }

    100% {
        opacity: 1;
        transform: scale(1) rotate(180deg);
    }
`;

export const Shareholder = styled.div`
    position: relative;
    display: inline-block;
    width: 120px;
    padding: 15px 20px;
    left: 3px;
    border-radius: 3px;
    border: 2px solid transparent;
    box-shadow: 0px 0px 10px var(--basic-shadow);
    background: #fff;
    margin: 0 20px;
    z-index: 1;
    transition: all 0.2s linear;
    min-height: 166px;
    transform: rotate(180deg);

    &.heading {
        box-shadow: none;
        padding: 0;
        width: auto;
        background: none;
        cursor: default;
    }

    &.isWithinShareholderThreshold {
        box-shadow: 0px 0px 10px var(--highlight);
        border: 2px solid var(--highlight);
    }

    &.animate {
        opacity: 0;
        transform: scale(0) rotate(180deg);
    }

    &.animateReady {
        opacity: 1;
        transform: scale(1) rotate(180deg);
    }

    ${Icon} {
        margin: 0 auto 10px auto;
    }
`

export const ShareholderList = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 20px;
    border-bottom: 1px solid var(--basic-shadow);
    margin-bottom: 20px;

    &:last-of-type {
        border: 0;
        padding-bottom: 0;
    }

    > div {
        margin: 0 !important;
    }
`;


export const Heading = styled.div`
    font-weight: bold;
    font-size: 2em;
    margin-bottom: 20px;
`

export const Label = styled.div`
    font-family: 'Avenir Next Condensed';
    position: relative;
    border-radius: 20px;
    
    &.P {
        text-transform: capitalize;
    }
`

export const Shares = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    font-family: Lato;
    font-weight: bold;
    padding-left: 10px;
    margin-bottom: 10px;
    font-size: 1.6em;

    > span {
        font-weight: bold;
        font-size: 0.8em;
        margin-right: 5px;
    }
`
