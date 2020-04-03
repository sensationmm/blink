import styled from 'styled-components';

export const Main = styled.div`
    position: fixed;
    box-sizing: border-box;
    width: 100%;
    left: 0;
    bottom: 0;
    padding: 20px;
    background: var(--brand-tertiary);
    display: flex;
    justify-content: space-between;
    transition: 0.2s ease-out;

    > div {
        min-width: 150px;
    }

    &.hide {
        transform: translateY(100%);
    }
`;
