import styled from 'styled-components';

export const Button = styled.button`
  position: relative;
  padding: 20px 40px;
  min-width: 280px;
  text-align: center;
  font-size: inherit;
  color: var(--basic-white);
  background: var(--brand-secondary);
  transition: all 0.2s;
  border-radius: 30px;
  white-space: nowrap;
  box-shadow: none;
  border: none;
  cursor: pointer;

  &:hover {
    background: var(--brand-primary);
  }

  &.full {
    width: 100%;
  }

  &.disabled {
    background: var(--basic-shadow);
    cursor: not-allowed;

    &:hover {
      background: var(--basic-shadow);
    }
  }
`;
