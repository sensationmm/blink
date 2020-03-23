import React from 'react';
import classNames from 'classnames';

import * as Styled from './styles';

interface ActionsProps {
    children: any;
    fill?: boolean;
}

const Actions: React.FC<ActionsProps> = ({ children, fill = false }) => {
    return (
        <Styled.Main className={classNames({ fill: fill })}>
            {children}
        </Styled.Main>
    );
}

export default Actions;
