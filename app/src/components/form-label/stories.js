import { text } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';
import * as React from 'react';

import FormLabel from '.';

storiesOf('Form|Label', module)
    .add('Default', () => (
        <FormLabel
            label={text('label', 'Form label')}
            tooltip={text('tooltip', 'Tooltip text here')}
        />
    ));
