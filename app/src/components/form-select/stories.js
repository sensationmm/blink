import { text, select, object } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';
import * as React from 'react';

import FormSelect from '.';

storiesOf('Form|Select', module)
    .add('Default', () => (
        <FormSelect
            label={text('label', 'Label goes here')}
            value={select('value', ['option1', 'option2'], 'option2')}
            options={object('options', [{ value: 'option1', label: 'Option 1' }, { value: 'option2', label: 'Option 2' }])}
        />
    ));
