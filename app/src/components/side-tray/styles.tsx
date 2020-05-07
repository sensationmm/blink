import styled from 'styled-components';

export const Content = styled.div`
    position: relative;
    width: 100%;
    height: 100%;
    background: var(--basic-white);
    z-index: 2;
`;

export const Close = styled.div`
    display: inline-block;
    margin-bottom: 20px;
    cursor: pointer;
    
    img {
        width: 10px;
    }
`;

export const Main = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    width: 30%;
    max-width: 400px;
    height: 100%;
    transform: translateX(-100%);
    transition: 0.2s ease-out;
    z-index: 2;

    &::before {
        display: none;
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        content: '';
        background: rgba(0,0,0, 0.4);
        z-index: 1;
    }

    &.open {
        transform: translateX(0);

        ${Content} {
            padding: 20px;
        }

        &:before {
            display: block;
        }
    }
`;
