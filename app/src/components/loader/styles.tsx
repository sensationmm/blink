import styled, { keyframes } from 'styled-components';

const ldsRipple = keyframes`
  0% {
    top: 50%;
    left: 50%;
    width: 0;
    height: 0;
    opacity: 1;
  }

  100% {
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
  }
`;

export const Loader = styled.div`
  position: fixed;
  z-index: 100000;
  top: 0px;
  left: 0px;
  background: rgba(0,0,0,0.2);
  width: 100vw;
  height: 100vh;
  
  .lds-ripple {
    width: 150px !important;
    height: 150px !important;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) scale(1);
  
    div {
      box-sizing: content-box;
      position: absolute;
      border-width: 4px;
      border-style: solid;
      opacity: 1;
      border-radius: 50%;
      border-color: var(--brand-primary);
      -webkit-animation: ${ldsRipple} 0.7s cubic-bezier(0, 0.2, 0.8, 1) infinite;
      animation: ${ldsRipple} 0.7s cubic-bezier(0, 0.2, 0.8, 1) infinite;
  
      &:nth-child(2) {
        -webkit-animation-delay: -0.35s;
        animation-delay: -0.35s;
      }
    }
  }
`;
