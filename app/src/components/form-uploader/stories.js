import { boolean, number, text, select } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';
import * as React from 'react';

import FormUploader from '.';

storiesOf('Form|Uploader', module)
    .add('Default', () => (
        <FormUploader
        />
    ));
