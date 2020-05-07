import styled from 'styled-components';

import { Main as Actions } from '../../layout/actions/styles';

export const Main = styled.div`
    max-width: 300px;
    margin: 0 auto;

    label {
        font-size: 0.8em;
        color: var(--basic-shadow);
    }
`;

export const CardContent = styled.div``;

export const Card = styled.div`
    position: relative;
    text-align: left;
    border: 1px solid var(--basic-shadow);
    border-radius: 5px;
    box-shadow: 0px 0px 10px var(--basic-shadow);
    padding: 20px;
    z-index: 2;
    background: var(--basic-white);

    &.disabled {
        ${CardContent} {
            opacity: 0.4;
            pointer-events: none;
        }
    }

    ${Actions} {
        padding-top: 0;
    }
`;

export const Add = styled.div`
    position: relative;
    border: 1px solid var(--basic-shadow);
    border-radius: 5px;
    padding: 20px;
    margin-bottom: 50px;
    z-index: 1;
    box-shadow: 0px 0px 10px var(--basic-shadow);

    &.cta {
        font-size: 0.8em;
        display: flex;
        border-color: var(--brand-secondary);
        cursor: pointer;

        &:hover {
            background: var(--brand-secondary);
            color: var(--basic-white);
        }
    }

    &.person {
        opacity: 0;
        pointer-events: none;
    }

    img {
        width: 10px;
        margin-right: 15px;
        color: red;
    }

    &:after {
        position: absolute;
        left: 50%;
        top: 100%;
        content: '';
        width: 1px;
        height: 100px;
        background: var(--basic-text);
    }

    ${Actions} {
        padding-top: 0;
    }
`;

export const Delete = styled.div`
    display: inline-block;
    color: var(--brand-secondary);
    padding: 10px;
    cursor: pointer;

    &:hover {
        color: var(--brand-primary);
    }

    &.disabled {
        opacity: 0;
    }
`;

export const Image = styled.div`
    width: 50px;
    height: 50px;
    border-radius: 26px;
    border: 2px solid #000;
    position: relative;
    margin-bottom: 10px;
    background: center top 10px no-repeat;
    background-size: contain;

    &.small {
        width: 20px;
        height: 20px;
        background-position: center top 3px;
        margin-bottom: 0;
    }

    &.person {
        background-color: var(--brand-person);
    }

    &.company {
        background-color: var(--brand-company);
    }
`;

export const ImageCompany = styled(Image)`
    background-color: var(--brand-company);
`;

export const ImagePerson = styled(Image)`
    background-color: var(--brand-person);
`;
