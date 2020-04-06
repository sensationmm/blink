import styled from 'styled-components';

export const Label = styled.div`
    width: 150px;
    margin-right: 20px;

    span {
        font-size: 0.8em;
        text-transform: uppercase;
        color: var(--basic-shadow);
        padding-left: 5px;
        font-weight: bold;
    }
`;

export const Icon = styled.div`
    margin-right: 30px;
    img {
        width: 26px;
    }
`;

export const Bar = styled.div`
    position: relative;
    width: 100%;
    height: 4px;
    border-radius: 2px;
    background: var(--basic-shadow);
    overflow: hidden;

    &.hasLabel {
        width: calc(100% - 170px);
    }
`;

export const Stat = styled.div`
    width: 60px;
    text-align: right;
    padding-left: 30px;
    z-index: 2;
    position: relative;
`;

export const Fill = styled.div`
    position: absolute;
    width: 0%;
    height: 100%;
    top: 0;
    background: var(--brand-primary);
    border-radius: inherit;
    transition: all ease-out 0.5s;
    z-index: 1;

    &.warning {
        background: var(--brand-warning);
    }

    &.controlled {
        background: var(--basic-black);
    }
`;

export const Stacker = styled.div`
    display: flex;
    align-items: center;
    position: relative;
    width: calc(100% - 60px);

    &.stacked {
        width: calc(100% - 60px);
        flex-direction: column;
        align-items: flex-start;

        ${Bar} {
            width: 100%;
        }

        ${Label} {
            width: 100%;
            margin-right: 0;
            margin-bottom: 10px;
        }
    }

    &.controlled {
        width: 100%;
    }
`;

export const ProgressBar = styled.div`
    position: relative;
    display: flex;
    align-items: center;

    &.large {
        ${Label} {
            display: none;
        }

        ${Stat} {
            font-size: 1.4em;
            width: 100%;
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
        }

        ${Bar} {
            width: 100%;
            height: 20px;
            border-radius: 10px;
        }

        ${Fill} {
            border-radius: 10px;
        }
    }
`;
