import styled from 'styled-components';

export const Button = styled.button`
  position: relative;
  height: 60px;
  padding: 20px 40px;
  min-width: 280px;
  font-size: inherit;
  color: var(--basic-white);
  transition: all 0.2s;
  border-radius: 30px;
  white-space: nowrap;
  box-shadow: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  align-content: center;
  justify-content: center;
  font-weight: bold;
  outline: none;
  border: 1px solid;

  &.full {
    width: 100%;
  }

  &.primary {
    background: var(--brand-secondary);
    border-color: var(--brand-secondary);
  }

  &.secondary {
    color: var(--brand-secondary);
    background: none;
    border-color: var(--brand-secondary);
  }

  &.tertiary {
    background: var(--basic-shadow);
    border-color: var(--basic-shadow);
  }

  &:hover:not(.disabled) {
    color: var(--basic-white);
    background: var(--brand-primary);
    border-color: var(--brand-primary);
  }

  &.hidden {
    display: none;
  }

  &.disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }

  .button-icon {
    margin-left: 20px;
    height: 20px;
  }

  &.small {
    padding: 10px 20px;
    min-width: 0;
    height: auto;
    font-size: 0.9em;
  }
`;
