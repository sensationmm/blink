import { boolean, number, text, select } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';
import * as React from 'react';

import Box from '.';

import IconSearch from '../../svg/icon-search.svg';
import IconLocation from '../../svg/icon-location.svg';
import IconTarget from '../../svg/icon-target.svg';

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

storiesOf('Layout Elements|box', module)
    .add('Default', () => (
        <Box
            children={FooList(number('Num children', 2))}
            padded={boolean('padded', true)}
            centered={boolean('centered', false)}
            shadowed={boolean('shadowed', false)}
            add={boolean('add', false)}
            title={text('title', '')}
            icon={select('icon', ['', IconSearch, IconLocation, IconTarget], '')}
        />
    ));
