import styled from 'styled-components';

export const User: any = styled.div`
    position: absolute;
    top: 20px;
    right: 20px;
    min-width: 100px;
    ${(props: any) => !props.fixed &&
        "position: relative; text-align: right; top: 0; right: 0; margin: 20px 0; width: 100%; clear: both;"

    }
`

export const Button = styled.button`
    border: none;
    background: none;
    outline: none;
`