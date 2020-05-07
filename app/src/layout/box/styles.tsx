import styled from 'styled-components';

export const Main = styled.div`
    position: relative;
    background: var(--basic-white);
    border: 1px solid var(--basic-shadow);
    border-radius: 10px;
    display: flex;
    flex-direction: column;

    &.hoverStyling:hover {
        border: 1px solid var(--brand-secondary);
    }

    &.padded {
        padding: 20px;
    }

    &.paddedLarge {
        padding: 40px;
    }

    &.centered {
        text-align: center;
        align-items: center;
    }

    &.shadowed {
        box-shadow: 0 0 5px var(--basic-shadow);
        &.hoverStyling:hover {
            box-shadow: 0 0 5px var(--brand-secondary);
        }
    }

    &.add {
        border: 1px dashed var(--brand-secondary);
        color: var(--basic-shadow);
    }

    > div {
        margin-bottom: 20px;

        &:last-of-type {
            margin-bottom: 0;
        }
    }
`


export const Title = styled.div`
    padding: 0 10px 10px 10px;
    text-transform: uppercase;
    font-weight: bold;
    display: flex;
    justify-content: flex-start;
    align-items: center;

    img {
        width: 20px;
        margin-right: 10px;
    }
`;
