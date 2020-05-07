import styled from 'styled-components';
import { Main as Box } from '../layout/box/styles';

export const Market = styled(Box)`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    box-shadow: 0 0 5px var(--basic-shadow);
    cursor: pointer;

    &.active {
        border-color: var(--brand-secondary);
    }

    &.disabled {
        filter: grayscale(1);
        pointer-events: none;

        &:after {
            content: 'Coming Soon';
            color: var(--basic-shadow);
            position: absolute;
            bottom: 30px;
            width: 100%;
            text-align: center;
            font-size: 0.8em;
            text-transform: uppercase;
        }
    }
`;

export const Inner = styled.div`
    width: 100%;
    position: relative;
    height: 0;
    padding-bottom: 100%;

    > div {
        position: absolute;
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }
`;

export const Country = styled.div`
    position: absolute;
    top: 30px;
    color: var(--basic-shadow);
`;

export const Flag = styled.img`
    width: 40px;
    height: 40px;
    border-radius: 20px;
    box-shadow: 0 0 5px var(--basic-shadow);

    img {
        width: 100%;
    }
`;

export const Filter = styled.ul`
    list-style: none;
    display: flex;
    padding: 0;
    margin: 0 0 40px 0;

    > li {
        margin-right: 20px;
        cursor: pointer;

        &:hover {
            text-decoration: underline;
        }

        &.active {
            color: var(--brand-secondary);
        }
    }
`;
