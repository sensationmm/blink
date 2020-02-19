import React from 'react';
import classNames from 'classnames';

import * as Styled from './styles';

interface BoxProps {
    children: any;
    padded?: boolean;
    centered?: boolean;
}

const Box: React.FC<BoxProps> = ({ children, padded = true, centered = false }) => {
    return (
        <Styled.Main className={classNames({ padded: padded }, { centered: centered })}>
            {children}
        </Styled.Main>
    );
}

export default Box;
