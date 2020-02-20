import styled from 'styled-components';

import * as FlexStyled from '../flex-row/styles';

export const Main = styled.div`
    align-content: center;

    ${FlexStyled.Main} {
        padding-bottom: 20px;
        margin-bottom: 20px;

        &:not(:first-of-type) {
            border-bottom: 1px solid var(--basic-shadow);
        }

        > div {
            display: flex;
            justify-content: center;
            align-items: center;

            &:first-child {
                justify-content: flex-start;
            }
        }
    }
`;

export const Header = styled.div`
    text-transform: uppercase;
    color: var(--basic-shadow);
    text-align: center;
    font-size: 0.9em;
`;

export const RowHeader = styled.div`
    display: flex;
    justify-content: flex-start;
    align-items: center;

    > div {
        margin-right: 30px;
    }
`;
