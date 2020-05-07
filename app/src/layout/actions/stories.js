import { number, boolean } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';
import * as React from 'react';

import Button from '../../components/button';

import Actions from '.';

const ButtonList = (num) => {
    const val = [];
    for (let i = 0; i < num; i++) {
        val.push(<Button key={`foo-${i}`} />);
    }

    return val;
};

storiesOf('Layout Elements|Actions', module)
    .add('Default', () => (
        <Actions
            children={ButtonList(number('Num buttons', 1))}
            fill={boolean('fill', false)}
        />
    ));
