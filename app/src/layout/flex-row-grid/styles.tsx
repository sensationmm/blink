import styled from 'styled-components';

export const Main = styled.div`
  position: relative;
  
  > div {
    width: 100%;
  }
`;

export const Item = styled.div`
  margin-bottom: 30px;

  &:last-of-type {
    margin-bottom: 0;
  }
`;
