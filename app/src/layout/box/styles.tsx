import styled from 'styled-components';

export const Main = styled.div`
    background: var(--basic-white);
    border: 1px solid var(--basic-shadow);
    border-radius: 10px;
    overflow: hidden;

    &.padded {
        padding: 15px 20px;
    }

    &.centered {
        text-align: center;
    }
`
