import { text, number, select, object } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';
import * as React from 'react';

import IconSearch from '../../svg/icon-search.svg';
import IconLocation from '../../svg/icon-location.svg';
import IconTarget from '../../svg/icon-target.svg';

import Stats, { Stat } from './';

import '../../index.css';

storiesOf('Components|Stat', module)
    .add('default', () => {
        return (
            <Stats list={object('list', [
                { label: 'First', icon: IconSearch, value: 1, total: 5 },
                { label: 'Second', icon: IconLocation, value: 3, total: 5 },
                { label: 'Third', icon: IconTarget, value: 2, total: 5 },
            ])} />
        )
    })
    .add('single', () => {
        return (
            <Stat
                label={text('label', 'Info')}
                value={number('value', 30)}
                total={number('total', 100)}
                icon={select('icon', [IconSearch, IconLocation, IconTarget], IconSearch)}
            />
        );
    });
