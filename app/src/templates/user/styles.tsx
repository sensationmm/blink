import styled from 'styled-components';

export const Main = styled.div`

`;

export const Logo = styled.div`
`;

export const Header = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 10px;
    background: var(--basic-white);
`;

export const Banner = styled.div`
    width: 100%;
    height: 250px;
    position: relative;
    background: linear-gradient(to top, rgba(31, 175, 214, 0.6) 0%, rgba(180, 232, 195, 0.6) 65.99%, rgba(167, 245, 227, 0.6) 95.61%);
    margin-bottom: 50px;
`;

export const BannerInner = styled.div`
    width: 100%;
    height: 100%;
    background: center center no-repeat;
`;
