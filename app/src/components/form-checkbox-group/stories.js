import { boolean, object } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';
import * as React from 'react';

import FormCheckboxGroup from '.';

storiesOf('Form|CheckboxGroup', module)
    .add('Default', () => (
        <FormCheckboxGroup
            options={object('options', [{ label: 'Yes' }, { label: 'No' }])}
        />
    ));
