import React from 'react';
import classNames from 'classnames';

import * as Styled from './styles';

interface ActionsProps {
    children: any;
    fill?: boolean;
    centered?: boolean;
}

const Actions: React.FC<ActionsProps> = ({ children, fill = false, centered = false }) => {
    return (
        <Styled.Main className={classNames({ fill: fill }, { centered: centered })}>
            {children}
        </Styled.Main>
    );
}

export default Actions;
