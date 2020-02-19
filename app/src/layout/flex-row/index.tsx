import cx from 'classnames';
import * as React from 'react';

import * as Styled from './styles';

export interface IFlexRowProps {
  children: React.ReactNode;
  layout?: number[] | string[];
}

const FlexRow: React.FC<IFlexRowProps> = ({ children, layout }) => (
  <Styled.Main>
    {(!layout || !Array.isArray(children)) && children}

    {layout &&
      Array.isArray(children) &&
      children.map((child, count) => {
        return (
          <div key={`child-${count}`} style={{ flexBasis: `${layout[count]}%` }}>
            {child}
          </div>
        );
      })}
  </Styled.Main>
);

export default FlexRow;
