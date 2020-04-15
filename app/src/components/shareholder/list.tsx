import React from 'react';
import cx from 'classnames';

import Icon from '../icon';
import PersonIcon from '../../svg/individual-icon.svg';

import * as Styled from './styles';

interface IShareholderListProps {
    name: string;
    shares?: number;
    type?: string;
}

const Shareholder: React.FC<IShareholderListProps> = ({ name, shares, type }) => {
    return (
        <Styled.ShareholderList className={cx({ 'isCompany': type === 'C' }, { 'isPerson': type === 'P' })}>
            <Icon icon={PersonIcon} style={'person'} />

            <Styled.ListLabel className={type}>{name}</Styled.ListLabel>

            {shares && <Styled.Shares><span>{shares.toFixed(2)}</span>%</Styled.Shares>}
        </Styled.ShareholderList >
    )
}

export default Shareholder;
