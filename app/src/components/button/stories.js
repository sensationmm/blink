import { text, boolean } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react';
import * as React from 'react';

import Button from './';

import '../../index.css';

storiesOf('Components|Button', module).add('default', () => {
    return (
        <Button
            label={text('label', 'Submit')}
            onClick={action('onClick')}
            disabled={boolean('disabled', false)}
            fullWidth={boolean('fullWidth', false)}
        />
    );
});
