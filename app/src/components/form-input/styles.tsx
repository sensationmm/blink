import styled from 'styled-components';

export const Field = styled.div`
    position: relative;
`;

export const FieldHolder = styled.div`
    position: relative;
`;

export const FieldLabel = styled.label`
    display: block;
    margin-bottom: 5px;
    text-transform: uppercase;
    font-size: 0.9em;
    font-weight: bold;
`;

export const MissingLabel = styled.span`
    color: var(--basic-text);
    padding-top: 5px;
    display: block;
`;

export const Save = styled.div`
    width: 30px;
    height: 30px;
    cursor: pointer;
`;

export const After = styled.div`
    display: flex;
    align-items: center;
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
`;

export const Suffix = styled.div`
    color: var(--basic-shadow);
`;
