import { select, text, boolean } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react';
import * as React from 'react';

import FormCheckbox from './';

import '../../index.css';

storiesOf('Form|Checkbox', module).add('default', () => {
    return (
        <FormCheckbox
            style={select('style', ['tick', 'group'], 'tick')}
            label={text('label', 'Hi')}
            checked={boolean('checked', false)}
            onChange={action('onChange')}
            disabled={boolean('disabled', false)}
        />
    );
});
