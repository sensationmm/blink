import { boolean, text } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react';
import * as React from 'react';

import ActionBar from '.';

storiesOf('Components|ActionBar', module)
    .add('Default', () => (
        <ActionBar
            labelPrimary={text('labelPrimary', 'Main Button')}
            labelSecondary={text('labelSecondary', 'Secondary Button')}
            actionPrimary={action('actionPrimary')}
            actionSecondary={action('actionSecondary')}
            hidden={boolean('hidden', false)}
        />
    ));
