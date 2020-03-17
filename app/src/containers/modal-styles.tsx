import styled from "styled-components";
import { Button } from  '../components/button/styles';

export const Modal = styled.div`
    &::after {
        position: fixed;
        z-index: 100000;
        top: 0px;
        left: 0px;
        background: rgba(0, 0, 0, 0.6);
        width: 100vw;
        height: 100vh;
        content: "";
    }
`

export const Heading = styled.h3`
    position: relative;
    margin: 0 0 10px;
`

export const Message = styled.div`
    width: 400px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    background-color: #fff;
    padding: 20px 20px 120px;
    text-align: center;
    z-index: 100001;
    border-radius: 3px;
    position: relative;
`

export const Actions = styled.div`
    position: absolute;
    bottom: 10px;
    left: 0;
    width: 100%;
    text-align: center;
    ${Button} {
        margin: 10px auto;
    }
`