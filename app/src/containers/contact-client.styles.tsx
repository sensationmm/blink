import styled from 'styled-components';

import { Main as Box } from '../layout/box/styles';
import { InputSt } from '../components/styles';

export const Item = styled.div`

    ${Box} {
        cursor: pointer;
        transition: border 0.2s linear;
    }

    &.disabled {
        ${Box} {
            cursor: not-allowed;
            opacity: 0.4;
        }

        &:hover {
            ${InputSt} {
                border-color: var(--brand-secondary);
                color: var(--brand-secondary);

                ::placeholder {
                    color: var(--brand-secondary);
                    opacity: 1; /* Firefox */
                }
                    
                :-ms-input-placeholder {
                    color: var(--brand-secondary);
                }
                    
                ::-ms-input-placeholder {
                    color: var(--brand-secondary);
                }
            }
        }
    }

    &.selected {
        ${Box} {
            border-color: var(--brand-secondary);
        }
    }
`;

export const Add = styled(Box)`
    cursor: pointer;
`;
