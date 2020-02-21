import styled from 'styled-components';

export const AccordionHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

export const Label = styled.div`
    display: flex;
    align-items: center;

    > div {
        margin-right: 20px;
    }
`;

export const Field = styled.div`
    position: relative;
`;

export const Error = styled.div`
    position: absolute;
    color: red;
    font-size: 0.9em;
    right: 0;
    top: 50%;
`;
