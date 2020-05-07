import React, { useState } from 'react';
import classNames from 'classnames';

import Error from '../../svg/error.svg';

import * as Styled from './styles';

interface TooltipProps {
    alt?: string;
    message: string | JSX.Element | JSX.Element[];
    alignment?: 'left' | 'center' | 'right';
    style?: 'basic' | 'alert';
}

const Tooltip: React.FC<TooltipProps> = ({ alt = 'Info', message, alignment = 'left', style = 'basic' }) => {
    const [showTooltip, setTooltip] = useState(false);

    return (
        <Styled.Main>
            <Styled.MissingIcon
                className={style}
                src={Error}
                alt={alt}
                onMouseEnter={() => setTooltip(true)}
                onMouseLeave={() => setTooltip(false)}
            />

            <Styled.Tooltip
                className={classNames(style, alignment, { active: showTooltip })}
            >
                {message}
            </Styled.Tooltip>
        </Styled.Main>
    )
}

export default Tooltip;
