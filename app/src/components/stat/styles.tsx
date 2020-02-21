import styled from 'styled-components';

export const Item = styled.div`
    display: flex;
`;

export const Main = styled.div`
    display: flex;

    ${Item} {
        margin-right: 20px;

        &:last-child {
            margin-right: 0;
        }
    }
`;

export const Icon = styled.img`
    height: 20px;
`;

export const Value = styled.div`
    font-weight: bold;
    padding-left: 10px;
`;
