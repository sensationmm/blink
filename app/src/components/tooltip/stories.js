import { text, select } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';
import * as React from 'react';

import Tooltip from '.';

storiesOf('Components|Tooltip', module)
    .addDecorator((story) => <div style={{ display: 'flex', justifyContent: 'center' }}>{story()}</div>)
    .add('Default', () => (
        <Tooltip
            alt={text('alt', 'Error')}
            message={text('message', 'Complete error message goes here')}
            alignment={select('alignment', ['left', 'center', 'right'], 'left')}
            style={select('style', ['basic', 'alert'], 'alert')}
        />
    ));
