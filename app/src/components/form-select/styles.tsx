import styled from 'styled-components';
import ArrowDown from '../../svg/arrow-down.svg';

export const Main = styled.div`
    position: relative;
    border-bottom: 2px solid var(--basic-shadow);
    
    label {
    }
  
    select {
      appearance: none;
      box-sizing: border-box;
      padding: 0;
      width: 80%;
      border: 0;
      height: 43px;
      background: none;
      z-index: 10;
      color: var(--basic-text);
      outline: 0;
      font-size: inherit;
    }
`;

export const Field = styled.div`
    position: relative;
    display: flex;
    align-items: center;
  
    &:after {
      content: '';
      display: block;
      position: absolute;
      right: 10px;
      top: 50%;
      transform: translateY(-50%);
      width: 20px;
      height: 20px;
      background: var(--basic-black);
      mask: url(${ArrowDown}) center center no-repeat;
      background-size: contain;
      z-index: 1;
      pointer-events: none;
    }
`;

export const Icon = styled.div`
    width: 30px;
    margin-right: 10px;
`;

export const Label = styled.label`
    display: block;
    margin-bottom: 5px;
    text-transform: uppercase;
    font-size: 0.9em;
    font-weight: bold;
`;
