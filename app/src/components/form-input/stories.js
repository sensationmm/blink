import { boolean, text, select } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react';
import * as React from 'react';

import FormInput from '.';

storiesOf('Form|Input', module)
    .add('Default', () => (
        <FormInput
            stateKey={'test'}
            label={text('label', 'Form field')}
            placeholder={text('placeholder', 'Enter text here')}
            onChange={action('onChange')}
            onBlur={action('onBlur')}
            value={''}
        />
    ));
