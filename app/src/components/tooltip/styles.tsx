import styled from 'styled-components';

export const Main = styled.div`
    position: relative;
    height: 24px;
    margin: 0 10px;
`;

export const MissingIcon = styled.img`
    width: 20px;
    height: 20px;
    border-radius: 12px;
    padding: 2px;
    cursor: pointer;
    display: flex;
    flex-shrink: 0;

    &.basic {
        background: var(--basic-shadow);
    }

    &.alert {
        background: var(--brand-warning);
    }
`;

export const Tooltip = styled.div`
    display: block;
    position: absolute;
    max-width: calc(90% - 40px);
    min-width: 100px;
    width: auto !important;
    top: 35px;
    padding: 15px 20px;
    z-index: 3;
    transform: scale(0);
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
        transform-origin: 7px 7px;
        transform: rotate(-45deg);
    }

    &.basic {
        background: var(--basic-shadow);

        &:before {
            background: var(--basic-shadow);
        }
    }

    &.alert {
        background: var(--brand-warning);

        &:before {
            background: var(--brand-warning);
        }
    }

    &.left {
        left: -5px;
        transform-origin: 0 0;

        &:before {
            left: 10px;
        }
    }

    &.center {
        left: 50%;
        transform: translateX(-50%) scale(0);
        transform-origin: 50% 0;

        &.active {
            transform: translateX(-50%) scale(1);
        }

        &:before {
            left: 50%;
            transform: translateX(-50%) rotate(-45deg);
        }
    }

    &.right {
        right: -5px;
        transform-origin: 100% 0;

        &:before {
            right: 10px;
        }
    }
`;
