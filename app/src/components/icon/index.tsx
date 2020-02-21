import React from 'react';
import classNames from 'classnames';

import * as Styled from './styles'

interface IconProps {
    icon: string;
    full?: boolean;
    style?: 'company' | 'person';
    size?: 'default' | 'small' | 'large';
}

const Icon: React.FC<IconProps> = ({ icon, full = false, style = 'company', size = 'default' }) => {
    return (
        <Styled.Main style={{ backgroundImage: `url(${icon})` }} className={classNames(style, size)} />
    )
};

export default Icon;
