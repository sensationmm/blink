import * as React from 'react';

import FlexRow from '../flex-row';

import * as Styled from './styles';

export interface IFlexRowGridProps {
  component: React.ReactType;
  content: object[];
  cols: number;
}

const FlexRowGrid: React.FC<IFlexRowGridProps> = ({ component, content, cols }) => {
  const numRows = Math.ceil(content.length / cols);

  const rows = [] as any;
  for (let i = 0; i < numRows; i++) {
    // break into slices for rendering into cols x grid markup
    rows[i] = content.slice(i * cols, i * cols + cols);
  }

  const remainder = new Array(cols * numRows - content.length).fill(null);

  const Component: React.ReactType = component;

  return (
    <Styled.Main>
      {rows.map((row: any, count: number) => {
        return (
          <Styled.Item key={`row-${count}`}>
            <FlexRow>
              {row.map((post: any, count2: number) => {
                return <Component key={`item-${count}-${count2}`} {...post} />;
              })}

              {count + 1 === rows.length &&
                remainder.map((fill, r) => {
                  return (
                    <div className="filler" key={`filler-${r}`}>
                      {fill}
                    </div>
                  );
                })}
            </FlexRow>
          </Styled.Item>
        );
      })}
    </Styled.Main>
  );
};

export default FlexRowGrid;
