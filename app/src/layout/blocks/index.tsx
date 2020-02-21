import React from 'react';

import * as Styled from './styles';

interface BlocksProps {
    children: any;
}

const Blocks: React.FC<BlocksProps> = ({ children }) => <Styled.Blocks>{children}</Styled.Blocks>;

export default Blocks;
