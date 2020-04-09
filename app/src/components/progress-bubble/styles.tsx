import styled from 'styled-components';

export const Content = styled.div`
    position: absolute;
    top: 2px;
    left: 2px;
    z-index: 3;
    width: 76px;
    height: 76px;
    border-radius: 38px;
    display: flex;
    align-items: center;
    justify-content: center;

    &.complete {
        background: var(--brand-primary) !important;
    }
`;

export const Inner = styled.div`
    position: absolute;
    top: 1px;
    left: 1px;
    width: 76px;
    height: 76px;
    z-index: 1;
    border-radius: 39px;
    border: 1px solid var(--basic-shadow);
`;

export const Fill = styled.svg`
    position: absolute;
    z-index: 2;
    top: 0;
    left: 0;
    transform: rotate(-90deg);
    border-radius: 40px;

    circle {
        fill: none;
        stroke: var(--brand-primary);
        stroke-width: 80;
        transition: stroke-dasharray .3s ease;
        stroke-dasharray: 0 158;
    }
`;

export const Main = styled.div`
    position: relative;
    font-family: Lato;
    font-weight: bold;
    width: 80px;
    height: 80px;
    
    &.person {
        ${Content} {
            background: var(--brand-person-faded);
        }
    }
    
    &.company {
        ${Content} {
            background: var(--brand-company-faded);
        }
    }
`;
