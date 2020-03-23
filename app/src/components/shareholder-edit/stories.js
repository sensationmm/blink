import { number, select, text } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react';
import * as React from 'react';

import { RawComponent as ShareholderEdit } from '.';

storiesOf('Components|Shareholder Edit', module)
    .add('Default', () => (
        <ShareholderEdit
            name={text('name', 'Spongebob Squarepants')}
            shares={number('shares', 23.46)}
            type={select('type', ['P', 'C'], 'P')}
            clearSideTray={action('clearSideTray')}
        />
    ));
