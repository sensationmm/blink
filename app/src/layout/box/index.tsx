import React from 'react';
import classNames from 'classnames';

import * as Styled from './styles';

interface BoxProps {
    children: any;
    padded?: boolean;
    paddedLarge?: boolean;
    centered?: boolean;
    title?: string;
    icon?: string;
    shadowed?: boolean;
}

const Box: React.FC<BoxProps> = ({ children, title, icon, padded = true, paddedLarge = false, centered = false, shadowed = false }) => {
    return (
        <div>
            {(title || icon) && (
                <Styled.Title>{icon && <img src={icon} />} {title}</Styled.Title>
            )}
            <Styled.Main className={classNames({ padded: padded }, { paddedLarge: paddedLarge }, { centered: centered }, { shadowed: shadowed })}>
                {children}
            </Styled.Main>
        </div>
    );
}

export default Box;
