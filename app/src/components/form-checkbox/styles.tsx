import styled from 'styled-components';
import IconTick from '../../svg/tick.svg';

export const Main = styled.div`
  font-size: 14px;
  cursor: pointer;
  display: flex;
  justify-content: flex-start;
  align-items: center;
`;

export const Checkbox = styled.div`
  position: relative;
  border-radius: 14px;
  min-width: 20px;
  height: 20px;
  margin: 0 10px;

  &.tick {
    background: var(--brand-warning);

    &.checked {
      background: var(--basic-black);
    }

    &.checked:before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      display: block;
      width: 100%;
      height: 100%;
      background: var(--basic-white);
      mask: url(${IconTick}) center center no-repeat;
    }
  }

  &.group {
    border: 2px solid var(--basic-shadow);
    background: var(--basic-shadow);

    &.checked:before {
      content: '';
      position: absolute;
      top: 2px;
      left: 2px;
      width: 16px;
      height: 16px;
      border-radius: 8px;
      background: var(--brand-secondary);
    }
  }

  &.disabled {
    border-color: var(--basic-shadow);
    background: var(--basic-shadow);
    pointer-events: none;

    + .checkbox-label {
      color: var(--basic-shadow);
    }
  }
`;
