import styled from 'styled-components';

export const Main = styled.div`
    display: flex;

  > * {
      width: 0;
      flex-grow: 1;
      margin-right: 30px;
  }

  > div:last-child {
      margin-right: 0;
  }
`;
