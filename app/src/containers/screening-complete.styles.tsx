import styled from 'styled-components';
import IconEmail from '../svg/icon-email.svg';

export const Main = styled.div`
    height: 400px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`

export const Image = styled.div`
    width: 300px;
    height: 200px;
    color: var(--brand-primary);
    fill: var(--brand-primary);
    background: var(--brand-primary);
    mask: url(${IconEmail}) center center no-repeat;
`;
