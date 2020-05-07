import styled from 'styled-components';

export const Main = styled.div`
  position: relative;
  
  > div {
    position: relative;
    width: 100%;
  }
`;

export const Item = styled.div`
  position: relative;
  margin-bottom: 30px;

  &:last-of-type {
    margin-bottom: 0;
  }
`;
