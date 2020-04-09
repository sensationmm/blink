import React from 'react';
import classNames from 'classnames';

import CompanyIcon from '../../svg/company-icon.svg';
import PersonIcon from '../../svg/individual-icon.svg';

import * as Styled from './styles'

interface IconProps {
    icon?: string;
    full?: boolean;
    style?: 'company' | 'person' | 'button' | 'other';
    size?: 'default' | 'small' | 'large';
    subIcon?: string;
}

const Icon: React.FC<IconProps> = ({ icon, full = false, style = 'company', size = 'default', subIcon }) => {
    return (
        <Styled.Main style={{ backgroundImage: `url(${icon})` }} className={classNames(style, size)}>
            {subIcon && <Styled.Sub style={{ backgroundImage: `url(${subIcon})` }} />}
        </Styled.Main>
    )
};

export default Icon;
