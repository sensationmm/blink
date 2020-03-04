import styled from 'styled-components';

export const NotRequired = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

export const Header = styled.div`
    display: flex;
    align-items: center;

    > div {
        margin-right: 30px;
    }
`;

export const Message = styled.div`
    text-transform: uppercase;
    color: var(--basic-shadow);
    font-size: 0.9em;
    font-weight: bold;
`;
