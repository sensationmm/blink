import { number, select } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';
import * as React from 'react';

import ProgressBubble from '.';

storiesOf('Components|ProgressBubble', module)
    .add('Default', () => (
        <ProgressBubble
            completed={number('completed', 2)}
            total={number('total', 5)}
            type={select('type', ['company', 'person'], 'company')}
        />
    ));
