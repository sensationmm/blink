import styled from 'styled-components';

export const Main = styled.div`
    display: flex;
    justify-content: flex-start;
    flex-direction: row-reverse;
    padding-top: 50px;

    > div, > button {
        margin-left: 20px;

        &:last-child {
            margin: 0;
        }
    }

    &.fill {
        > div, > button {
            width: 0;
            flex-grow: 1;
        }
    }

    &.centered {
        justify-content: center;
        flex-direction: row;
    }
`
