import { text, select } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';
import * as React from 'react';

import IconTitle from '.';

import IconSearch from '../../svg/icon-search.svg';
import IconLocation from '../../svg/icon-location.svg';
import IconTarget from '../../svg/icon-target.svg';

storiesOf('Layout Elements|IconTitle', module)
    .add('Default', () => (
        <IconTitle
            title={text('title', 'Title here')}
            icon={select('icon', ['', IconSearch, IconLocation, IconTarget], IconSearch)}
        />
    ));
