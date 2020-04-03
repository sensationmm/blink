import styled from 'styled-components';

export const Main = styled.div`
    position: relative;
`;

export const Tooltip = styled.div`
    position: absolute;
    right: 0;
    top: 50%;
    display: flex;
    flex-shrink: 0;
    transform: translateY(-50%);
    z-index: 3;
`;

export const HasError = styled.div`
    padding-right: 40px;
`;
