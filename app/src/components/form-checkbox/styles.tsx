import styled from 'styled-components';

export const Main = styled.div`
  font-size: 14px;
  cursor: pointer;
  display: flex;
  justify-content: flex-start;
  align-items: center;
`;

export const Checkbox = styled.div`
  position: relative;
  background: var(--brand-warning);
  border-radius: 10px;
  min-width: 20px;
  height: 20px;
  margin-right: 10px;
  background: $white;

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
    mask: url('../../svg/tick.svg') center center no-repeat;
  }

  &.error {
    border-color: var(--brand-warning);

    &.checked:before {
      background: var(--brand-warning);
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
