import styled from 'styled-components';

export const Controls = styled.div`
    padding: 20px;
    margin-bottom: 20px;

    input[type='range'] {
        width: 200px;
    }
`

export const ControlItem = styled.div`
    padding: 10px 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 0.9em;

    div {
        font-weight: bold;
        font-size: 2em;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-right: 15px;

        span {
            font-size: 0.5em;
            padding-left: 5px;
        }
    }
`;
