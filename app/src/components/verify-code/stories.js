import { boolean, number, text, select } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';
import * as React from 'react';

import VerifyCode from '.';

storiesOf('Components|VerifyCode', module)
    .add('Default', () => (
        <VerifyCode
            value={text('value', '123456')}
        />
    ));
