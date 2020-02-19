import React from 'react';
import cx from 'classnames';

import CompanyIcon from '../../svg/company-icon.svg';
import PersonIcon from '../../svg/individual-icon.svg';

import * as Styled from './styles';

interface IShareholderListProps {
    name: string;
    shares?: number;
    type?: string;
}

const Shareholder: React.FC<IShareholderListProps> = ({ name, shares, type }) => {
    const ShareholderImage = type === 'P' ? Styled.ImagePerson : Styled.ImageCompany;
    const ShareholderLabel = type ? Styled.Label : Styled.Heading;
    const ShareholderIcon = type === 'P' ? PersonIcon : CompanyIcon;

    return (
        <Styled.ShareholderList className={cx({ 'isCompany': type === 'C' }, { 'isPerson': type === 'P' })}>
            <ShareholderImage className={!type ? 'large' : ''} style={{ backgroundImage: `url(${ShareholderIcon})` }} />

            <ShareholderLabel className={type}>{name}</ShareholderLabel>

            {shares && <Styled.Shares><span>{shares.toFixed(2)}</span>%</Styled.Shares>}
        </Styled.ShareholderList >
    )
}

export default Shareholder;
