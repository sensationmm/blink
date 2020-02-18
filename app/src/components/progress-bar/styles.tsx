import styled from 'styled-components';

export const Label = styled.div`
    width: 150px;
    text-align: right;
    padding-right: 10px;
`;

export const Bar = styled.div`
    position: relative;
    width: calc(100% - 210px);
    height: 20px;
    border-radius: 10px;
    background: var(--basic-shadow);
    overflow: hidden;
`;

export const Stat = styled.div`
    width: 60px;
    text-align: left;
    padding-left: 10px;
    z-index: 2;
    position: relative;
`;

export const Fill = styled.div`
    position: absolute;
    width: 0%;
    height: 100%;
    top: 0;
    left: -2px;
    background: var(--brand-primary);
    border-radius: inherit;
    transition: all ease-out 0.5s;
    z-index: 1;
`;

export const ProgressBar = styled.div`
    position: relative;
    display: flex;
    margin-bottom: 20px;

    &.large {
        margin-bottom: 40px;
        
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
            height: 40px;
            border-radius: 20px;
        }

        ${Fill} {
            border-radius: 20px;
        }
    }
`;
