import { text, boolean, number, select } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';
import * as React from 'react';

import CompanyIcon from '../../svg/company-icon.svg';
import PersonIcon from '../../svg/individual-icon.svg';

import Icon from './';

import '../../index.css';

storiesOf('Components|Icon', module).add('default', () => {
    return (
        <Icon
            icon={select('icon', [CompanyIcon, PersonIcon], CompanyIcon)}
            style={select('style', ['company', 'person'], 'company')}
        />
    );
});
