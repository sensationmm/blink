import styled from 'styled-components';

export const Blocks = styled.div`
    width: 100%;
    
    > div {
        margin-bottom: 40px;

        &:last-child {
            margin-bottom: 0;
        }
    }

    &.small {
        > div {
            margin-bottom: 20px;
        }
    }
`;
