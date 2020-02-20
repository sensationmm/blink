import { text, boolean, number, select } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';
import * as React from 'react';

import IconSearch from '../../svg/icon-search.svg';
import IconLocation from '../../svg/icon-location.svg';
import IconTarget from '../../svg/icon-target.svg';

import ProgressBar from './';

import '../../index.css';

storiesOf('Components|ProgressBar', module).add('default', () => {
    return (
        <ProgressBar
            large={boolean('large', false)}
            label={text('label', 'Something')}
            value={number('value', 30)}
            total={number('total', 100)}
            icon={select('icon', ['', IconSearch, IconLocation, IconTarget], '')}
        />
    );
});
