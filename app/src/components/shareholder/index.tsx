import React from 'react';

import CompanyIcon from '../../svg/company-icon.svg';
import PersonIcon from '../../svg/individual-icon.svg';

import * as Styled from './styles';

interface IShareholderProps {
    name: string;
    shares?: number;
    type?: string;
}

const Shareholder = ({ name, shares, type }: IShareholderProps) => {
    const ShareholderImage = type ? (type === 'C' ? Styled.ImageCompany : Styled.ImagePerson) : Styled.ImageRoot;
    const ShareholderLabel = type ? Styled.Label : Styled.Heading;
    const ShareholderIcon = type === 'P' ? PersonIcon : CompanyIcon;

    return (
        <Styled.Shareholder className={!type ? 'heading' : ''}>
            <ShareholderImage style={{ backgroundImage: `url(${ShareholderIcon})` }} />
            {shares && <Styled.Shares>{shares}%</Styled.Shares>}
            <ShareholderLabel>{name}</ShareholderLabel>
        </Styled.Shareholder>
    )
}

export default Shareholder;
