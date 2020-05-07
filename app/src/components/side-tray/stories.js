import { boolean } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react';
import * as React from 'react';

import { RawComponent as SideTray } from '.';
import { actions } from '@storybook/addon-actions';

const Foo = () => {
    return <div style={{ backgroundColor: 'red' }}>foo</div>;
};

storiesOf('Components|Side Tray', module)
    .add('Default', () => (
        <div style={{ width: '100vw', padding: 0, margin: 0, height: '100vh', background: 'grey' }}>
            <SideTray
                open={boolean('open', false)}
                Component={Foo}
                params={{}}
                clearSideTray={action('clearSideTray')}
            />
        </div>
    ));
