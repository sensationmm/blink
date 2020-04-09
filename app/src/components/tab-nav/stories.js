import { boolean, number, text, select, object } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';
import * as React from 'react';

import TabNav from '.';

storiesOf('Components|TabNav', module)
    .add('Default', () => (
        <TabNav
            items={object('items', [
                {
                    label: 'Label 1',
                    stat: '1/2',
                    content: 'Content 1'
                },
                {
                    label: 'Label 2',
                    content: <div>Content 2</div>
                },
                {
                    label: 'Label 3',
                    content: <div>Content 3</div>
                },
                {
                    label: 'Label 4',
                    content: <div>Content 4</div>
                },
                {
                    label: 'Label 5',
                    content: <div>Content 5</div>
                }
            ])}
        />
    ));
