import React from 'react';
import classNames from 'classnames';

import CompanyIcon from '../../svg/company-icon.svg';
import PersonIcon from '../../svg/individual-icon.svg';

import * as Styled from './styles'

interface IconProps {
    icon?: string;
    full?: boolean;
    style?: 'company' | 'person' | 'button';
    size?: 'default' | 'small' | 'large';
}

const Icon: React.FC<IconProps> = ({ icon, full = false, style = 'company', size = 'default' }) => {
    if (style === 'person') {
        icon = PersonIcon;
    } else if (style === 'company') {
        icon = CompanyIcon;
    }

    return (
        <Styled.Main style={{ backgroundImage: `url(${icon})` }} className={classNames(style, size)} />
    )
};

export default Icon;
