import styled from 'styled-components';

export const Main = styled.div`
    display: flex;
    justify-content: center;
`;

export const Label = styled.label`
    display: block;
    font-size: 20px;
    margin-bottom: 10px;

    &.left {
        width: 100%;
    }

    &.bold {
        font-size: 20px !important;
        width: auto;
        color: var(--basic-text) !important;
    }
`;