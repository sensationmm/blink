import { boolean, text } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';
import * as React from 'react';

import Accordion from '.';

storiesOf('Layout Elements|Accordion', module)
    .add('Default', () => (
        <Accordion
            header={<div>Hi</div>}
            content={<div>{text('content', 'sfsdfdfsdf')}</div>}
        />
    ));
