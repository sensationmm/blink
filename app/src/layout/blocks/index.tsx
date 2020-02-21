import React from 'react';
import classNames from 'classnames';

import * as Styled from './styles';

interface BlocksProps {
    children: any;
    gutter?: 'regular' | 'small';
}

const Blocks: React.FC<BlocksProps> = ({ children, gutter = 'regular' }) => <Styled.Blocks className={classNames({ small: gutter === 'small' })}>{children}</Styled.Blocks>;

export default Blocks;
