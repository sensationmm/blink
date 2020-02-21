import styled from 'styled-components';

export const Main = styled.div`
    position: relative;
`;

export const Header = styled.div`
    cursor: pointer;
    padding-right: 40px;
`;

export const Toggle = styled.div`
    position: absolute;
    top: 0;
    right: 0;
    width: 30px;
    height: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
    color: red;
    fill: red;
    transform: rotate(-90deg);
    mask: red;

    img, svg {
        color: red;
        fill: red;
    }
`;



export const Content = styled.div`
    padding: 30px 60px;
`;
