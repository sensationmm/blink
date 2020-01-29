import React from 'react';

import CompanyIcon from '../../svg/company-icon.svg';
import PersonIcon from '../../svg/individual-icon.svg';

import * as Styled from './styles';

interface IShareholderProps {
    name: string;
    shares?: number;
    type?: string;
    showDetail?: (content: JSX.Element) => void;
}

const Shareholder = ({ name, shares, showDetail, type }: IShareholderProps) => {
    const ShareholderImage = type ? (type === 'C' ? Styled.ImageCompany : Styled.ImagePerson) : Styled.ImageRoot;
    const ShareholderLabel = type ? Styled.Label : Styled.Heading;
    const ShareholderIcon = type === 'P' ? PersonIcon : CompanyIcon;

    const details = <>
        <ShareholderImage style={{ backgroundImage: `url(${ShareholderIcon})` }} />
    </>;

    return (
        <Styled.Shareholder className={!type ? 'heading' : ''} onClick={() => showDetail ? showDetail(details) : null}>
            <ShareholderImage style={{ backgroundImage: `url(${ShareholderIcon})` }} />
            {shares && <Styled.Shares>{shares.toFixed(2)}%</Styled.Shares>}
            <ShareholderLabel>{name}</ShareholderLabel>
        </Styled.Shareholder>
    )
}

export default Shareholder;
