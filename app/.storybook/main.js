const path = require('path');

module.exports = {
  stories: ['../src/**/stories.js'],
  addons: [
    '@storybook/addon-actions',
    '@storybook/addon-links',
    '@storybook/addon-knobs',
    '@storybook/addon-viewport/register',
    '@storybook/preset-typescript',
  ],
};
