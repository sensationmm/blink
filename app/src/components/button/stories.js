import { text, boolean, select } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react';
import * as React from 'react';

import Button from './';

import ArrowRight from '../../svg/arrow-right.svg';
import IconEmail from '../../svg/icon-email.svg';
import '../../index.css';

storiesOf('Components|Button', module).add('default', () => {
    return (
        <Button
            label={text('label', 'Submit')}
            type={select('type', ['primary', 'secondary'], 'primary')}
            onClick={action('onClick')}
            disabled={boolean('disabled', false)}
            fullWidth={boolean('fullWidth', false)}
            icon={select('icon', [undefined, ArrowRight, IconEmail], undefined)}
        />
    );
});
