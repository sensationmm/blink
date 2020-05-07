import styled from 'styled-components';

export const Main = styled.div`
    position: fixed;
    box-sizing: border-box;
    width: 100%;
    left: 0;
    bottom: 0;
    padding: 20px;
    background: var(--brand-tertiary);
    transition: 0.2s ease-out;

    &.hide {
        transform: translateY(100%);
    }
`;

export const Header = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    color: var(--basic-white);
    margin-bottom: 20px;

    > div {
        display: flex;
        align-items: center;
    }
`;

export const Buttons = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;

    > div {
        min-width: 150px;
    }
`;
