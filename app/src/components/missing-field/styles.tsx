import styled from 'styled-components';

export const Main = styled.div`
    position: relative;
`;

export const MissingIcon = styled.img`
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 20px;
    height: 20px;
    border-radius: 12px;
    padding: 2px;
    background: var(--brand-warning);
    margin-left: 10px;
    cursor: pointer;
    display: flex;
    flex-shrink: 0;
`;

export const Tooltip = styled.div`
    position: absolute;
    display: block;
    max-width: calc(90% - 40px);
    width: auto !important;
    right: 0;
    top: calc(100% - 10px);
    background: var(--brand-warning);
    padding: 15px 20px;
    z-index: 3;
    transform: scale(0);
    transform-origin: 100% 0;
    transition: 0.1s linear;
    box-shadow: 0px 0px 10px var(--basic-shadow);
    font-size: 0.8em;
    border-radius: 5px;

    > div {
        margin-bottom: 10px;

        &:last-of-type {
            margin-bottom: 0;
        }
    }

    &.active {
        transform: scale(1);
    }

    &:before {
        content: '';
        width: 14px;
        height: 14px;
        position: absolute;
        top: -5px;
        right: 5px;
        transform-origin: 7px 7px;
        transform: rotate(-45deg);
        background: var(--brand-warning);
    }
`;
