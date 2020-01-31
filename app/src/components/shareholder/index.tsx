import React from 'react';
import cx from 'classnames';

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
    const ShareholderImage = type === 'P' ? Styled.ImagePerson : Styled.ImageCompany;
    const ShareholderLabel = type ? Styled.Label : Styled.Heading;
    const ShareholderIcon = type === 'P' ? PersonIcon : CompanyIcon;

    const details = <>
        <ShareholderImage className={'large'} style={{ backgroundImage: `url(${ShareholderIcon})` }} />
        <ShareholderLabel>{name}</ShareholderLabel>
    </>;

    return (
        <Styled.Shareholder className={cx({ 'heading': !type }, { 'isCompany': type === 'C' }, { 'isPerson': type === 'P' })} onClick={() => showDetail ? showDetail(details) : null}>
            <ShareholderImage className={!type ? 'large' : ''} style={{ backgroundImage: `url(${ShareholderIcon})` }} />
            {shares && <Styled.Shares>{shares.toFixed(2)}%</Styled.Shares>}
            <ShareholderLabel>{name}</ShareholderLabel>
        </Styled.Shareholder >
    )
}

export default Shareholder;
