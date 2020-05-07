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

export const Alert = styled(Message)`
    color: var(--brand-secondary);
    text-align: center;
`;

export const Role = styled.span`
    text-transform: uppercase;
    font-size: 0.8em;
    color: var(--basic-shadow);
`;
