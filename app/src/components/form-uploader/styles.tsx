import styled from 'styled-components';

export const Main = styled.div`
    width: 100%;
    position: relative;

    p {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        position: relative;
        top: 0;
        left: 0;
        margin: 0;
        height: 200px;
        cursor: pointer;
    }

    section, div {
        position: relative;
        width: 100%;
        height: 100%;
    }
`;

export const Delete = styled.img`
    position: absolute;
    top: 10px;
    right: 10px;
    z-index: 2;
    width: 30px;
    height: 30px;
    background: var(--brand-secondary);
    padding: 5px;
    border-radius: 20px;
    transform: rotate(45deg);
    cursor: pointer;
`;

export const Preview = styled.div`
    width: 100%;

    img {
        max-width: 500px;
        max-height: 500px;
    }
`;
