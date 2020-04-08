import React from 'react';

import * as Styled from './styles';

interface IconTitleProps {
    icon: string | JSX.Element;
    title: string;
}

const IconTitle: React.FC<IconTitleProps> = ({ icon, title }) => {
    return (
        <Styled.Main>
            {(title || icon) && (
                <Styled.Main>{icon && (typeof icon === 'string' ? <img alt={title} src={icon} /> : icon)} {title}</Styled.Main>
            )}
        </Styled.Main>
    )
}

export default IconTitle;
