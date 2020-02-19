import { array, number } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';
import * as React from 'react';

import FlexRow from '.';

const Foo = () => {
  return <div style={{ backgroundColor: 'red' }}>foo</div>;
};

const FooList = (num) => {
  const val = [];
  for (let i = 0; i < num; i++) {
    val.push(<Foo key={`foo-${i}`} />);
  }

  return val;
};

storiesOf('Layout Elements|flex-row', module)
  .add('Default', () => (
    <FlexRow
      children={FooList(number('Num columns', 3))}
      layout={array('Layout [%] must match num columns eg. 10,30,60', [])}
    />
  ));
