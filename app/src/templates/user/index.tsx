import React from 'react';

import User from '../../containers/User';

import Logo from '../../svg/blink-logo.svg';

import * as Styled from './styles';

interface TemplateUserProps {
    headerIcon: string;
}

const TemplateUser: React.FC<TemplateUserProps> = ({ headerIcon, children }) => {
    return (
        <Styled.Main>
            <Styled.Header>
                <Styled.Logo><img src={Logo} /></Styled.Logo>
                <User showDisplayName={false} />
            </Styled.Header>

            <Styled.Banner>
                <Styled.BannerInner style={{ backgroundImage: `url(${headerIcon})` }} />
            </Styled.Banner>

            {children}
        </Styled.Main>
    )
}

export default TemplateUser;
