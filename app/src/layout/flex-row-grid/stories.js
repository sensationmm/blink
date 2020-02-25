import { number } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';
import * as React from 'react';

import FlexRowGrid from '.';

const Foo = () => {
  return <div style={{ backgroundColor: 'red' }}>foo</div>;
};

const FooList = (num) => {
  const val = [];
  for (let i = 0; i < num; i++) {
    val.push({ title: 'Some title' });
  }

  return val;
};

storiesOf('Layout Elements|flex-row-grid', module)
  .addDecorator((story) => <div style={{ width: '80vw' }}>{story()}</div>)
  .add('Default', () => (
    <FlexRowGrid component={Foo} content={FooList(number('content (count)', 7))} cols={number('cols', 3)} />
  ));
