import { number, select, text, object } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react';
import * as React from 'react';

import { RawComponent as ShareholderEdit } from '.';

storiesOf('Components|Shareholder Edit', module)
    .add('Default', () => (
        <ShareholderEdit
            shares={number('shares', 23.46)}
            clearSideTray={action('clearSideTray')}
            shareholder={object('shareholder', { 'name': { 'value': 'Spongebob Squarepants' }, 'shareholderType': 'P' })}
        />
    ));
