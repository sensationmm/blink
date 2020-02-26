import React from 'react';
import cx from 'classnames';

import Icon from '../icon';

import * as Styled from './styles';

interface IShareholderListProps {
    name: string;
    shares?: number;
    type?: string;
}

const Shareholder: React.FC<IShareholderListProps> = ({ name, shares, type }) => {
    const ShareholderLabel = type ? Styled.Label : Styled.Heading;
    const ShareholderIcon = type === 'P' ? 'person' : 'company';

    return (
        <Styled.ShareholderList className={cx({ 'isCompany': type === 'C' }, { 'isPerson': type === 'P' })}>
            <Icon style={ShareholderIcon} />

            <ShareholderLabel className={type}>{name}</ShareholderLabel>

            {shares && <Styled.Shares><span>{shares.toFixed(2)}</span>%</Styled.Shares>}
        </Styled.ShareholderList >
    )
}

export default Shareholder;
