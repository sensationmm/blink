import { select, text } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';
import * as React from 'react';

import ScreeningStatus, { steps } from './';

import '../../index.css';

storiesOf('Components|ScreeningStatus', module).add('default', () => {
    const pages = steps.map(item => item.url);

    return (
        <ScreeningStatus
            activeStep={select('activeStep', pages, pages[2])}
            company={text('company', 'Leveris Limited')}
            country={text('country', 'Ireland')}
        />
    );
});
