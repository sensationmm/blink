import React from 'react';
import { withKnobs } from '@storybook/addon-knobs';
import { addDecorator, configure } from '@storybook/react';
import StoryRouter from 'storybook-react-router';

// import appTemplateDecorator from './decorators/app-template';

const req = require.context('../src', true, /^((?![\\/]node_modules[\\/]).)*\.stories\.(tsx|ts|js)$/);

const loadStories = () => {
    req.keys().forEach((filename) => req(filename));
};

addDecorator(withKnobs);
addDecorator(StoryRouter());
addDecorator((story) => <div style={{ padding: '20px', background: '#fafafa' }}>{story()}</div>)

// @ts-ignore
global.__PATH_PREFIX__ = '';

configure(loadStories, module);
