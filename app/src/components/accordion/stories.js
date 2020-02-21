import { boolean, number, text, select } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';
import * as React from 'react';

import Accordion from '.';

storiesOf('Layout Elements|Accordion', module)
    .add('Default', () => (
        <Accordion
            shadowed={boolean('shadowed', false)}
            title={text('title', '')}
        />
    ));
