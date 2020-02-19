import styled from 'styled-components';

export const Main = styled.div`
    width: calc(100% + 60px);
    margin: 0 -30px;
`;

export const Header = styled.header`
    text-align: center;
    background: var(--basic-white);
    padding-bottom: 20px;
`;

export const Nav = styled.nav`
    width: 100%;
    display: flex;
    justify-content: stretch;
    margin-bottom: 75px;
    background: var(--basic-white);
`;

export const NavItem = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    width: 0;
    flex-grow: 1;
    color: var(--basic-shadow);
    border-right: 2px solid var(--basic-shadow);
    border-bottom: 2px solid var(--basic-white);
    padding: 10px 15px 15px 15px;

    &:last-child {
        border-right: 0;
    }

    &.active {
        color: var(--basic-text);
        border-bottom: 2px solid var(--brand-primary);
    }
`;

export const Info = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 75px;
    padding: 0 30px;

    a {
        display: flex;
        align-items: center;
        color: inherit;
        text-decoration: none;

        img {
            margin-right: 20px;
        }
    }
`;

export const Title = styled.div`
    display: flex;
    justify-content: flex-start;
`;

export const CompanyInfo = styled.div`
    display: flex;
    align-items: center;
    color: var(--basic-shadow);

    div {
        margin-right: 30px;

        &:last-of-type {
            margin-right: 0;
        }

        span {
            color: var(--basic-text);
        }
    }
`;
