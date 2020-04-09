import styled from 'styled-components';

export const Main = styled.div`
    position: relative;
`;

export const Nav = styled.nav`
    display: flex;
    justify-content: center;
    margin-bottom: 30px;

    &.hasStats {
        margin-bottom: 50px;
    }
`;

export const NavItem = styled.div`
    position: relative;
    padding: 0 20px 10px 20px;
    margin: 0 20px;
    border-bottom: 2px solid var(--basic-shadow);
    cursor: pointer;
    transition: all 0.2s linear;

    &.active {
        border-color: var(--brand-secondary);
    }
`;

export const Stat = styled.div`
    position: absolute;
    left: 0;
    bottom: -30px;
    text-align: center;
    width: 100%;
    font-size: 0.8em;
    font-weight: bold;
    color: var(--basic-shadow);
`;

export const Content = styled.div`
    width: 100%;
    position: relative;
    overflow-x: hidden;
`;

export const ContentInner = styled.div`
    display: flex;
    transition-property: all;
    transition-timing-function: ease-out;
`;

export const ContentItem = styled.div`
    box-sizing: border-box;
    padding: 0 10px;
    overflow: hidden;
`;
