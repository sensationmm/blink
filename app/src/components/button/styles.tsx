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

  &.full {
    width: 100%;
  }

  &.primary {
    background: var(--brand-secondary);
  }

  &.secondary {
    background: var(--basic-shadow);
  }

  &:hover:not(.disabled) {
    background: var(--brand-primary);
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
`;
